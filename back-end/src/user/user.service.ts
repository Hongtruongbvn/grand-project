import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GlobalRoleService } from 'src/global-role/global-role.service';
import { InterestService } from 'src/interest/interest.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly globalRoleService: GlobalRoleService,
    private readonly interestService: InterestService,
    private readonly mailService: MailService,
  ) {}
  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hash = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hash,
      });
      const savedUser = await createdUser.save();
      await this.setDefaultRole(savedUser._id as string);
      return savedUser;
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern || {})[0];
        if (field === 'username') {
          throw new BadRequestException('Tên người dùng đã tồn tại');
        } else if (field === 'email') {
          throw new BadRequestException('Email đã được sử dụng');
        }
        throw new BadRequestException('Thông tin đăng ký bị trùng lặp');
      }
      throw error;
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateResetPasswordOtp(
    email: string,
    otp: string | null,
    expiry: Date | null,
  ) {
    return this.userModel.updateOne(
      { email },
      { resetPasswordOtp: otp, resetPasswordOtpExpiry: expiry },
    );
  }

  async updatePassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.userModel.updateOne(
      { email },
      {
        password: hashedPassword,
        resetPasswordOtp: null,
        resetPasswordOtpExpiry: null,
      },
    );
  }

// Mã đã sửa (HIỂN THỊ ĐƯỢC SỞ THÍCH) Nam sửa
async findById(userId: string) {
  const user = await this.userModel
    .findById(userId)
    .select('-password')
    .populate('interest_id'); // <--- THÊM DÒNG NÀY ĐỂ LẤY THÔNG TIN CHI TIẾT CỦA SỞ THÍCH

  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

  async updateProfile(userId: string, updateDto: UpdateUserDto) {
    await this.userModel.updateOne({ _id: userId }, { $set: updateDto });
    return this.findById(userId);
  }
  async setDefaultRole(userId: string) {
    const role = await this.globalRoleService.findByName('user');

    return this.userModel.updateOne(
      { _id: userId },
      { $set: { global_role_id: role?._id } },
    );
  }
  async addInterestsToUser(userId: string, interestIds: string[]) {
    const validInterests = await this.interestService.findByIds(interestIds);

    if (validInterests.length !== interestIds.length) {
      throw new BadRequestException('Một hoặc nhiều sở thích không hợp lệ');
    }

    return this.userModel.updateOne(
      { _id: userId },
      { $set: { interest_id: interestIds } },
    );
  }
  async findUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).select('-password');
    if (!user) {
      throw new Error('User with this email not found');
    }
    return user;
  }
  async findByGender(gender: 'male' | 'female' | 'other') {
    const users = await this.userModel.find({ gender }).select('-password');
    if (!users || users.length === 0) {
      throw new Error(`No users found with gender: ${gender}`);
    }
    return users;
  }
  async findByInterestIds(interestIds: Types.ObjectId[]) {
    const users = await this.userModel
      .find({ interest_id: { $in: interestIds } })
      .select('-password');

    if (!users || users.length === 0) {
      throw new Error('No users found with the provided interest IDs');
    }

    return users;
  }
  async sendFriendRequest(fromUserId: string, toUserId: string) {
    const toUser = await this.userModel.findById(toUserId);

    if (!toUser) {
      throw new Error('User to send request to not found');
    }

    if (toUser.acceptFriend.includes(fromUserId)) {
      throw new Error('Friend request already sent');
    }
    const fromObjectId = new Types.ObjectId(fromUserId);

    if (toUser.friend_id.some((id) => id.equals(fromObjectId))) {
      throw new Error('This user already your friend');
    }
    const toUserIdStr = (toUser._id as Types.ObjectId).toString();

    if (fromUserId === toUserIdStr) {
      throw new Error('You cannot send a friend request to yourself');
    }

    toUser.acceptFriend.push(fromUserId);
    await toUser.save();

    return { message: 'Friend request sent successfully' };
  }
  async acceptFriendRequest(currentUserId: string, requesterId: string) {
    const currentUser = await this.userModel.findById(currentUserId);
    const requester = await this.userModel.findById(requesterId);
    console.log(requester);
    console.log(currentUser);

    if (!currentUser || !requester) {
      throw new Error('User not found');
    }

    currentUser.acceptFriend = currentUser.acceptFriend.filter(
      (id) => id !== requesterId,
    );

    const requesterObjectId = new Types.ObjectId(requesterId);
    const currentUserObjectId = new Types.ObjectId(currentUserId);

    currentUser.friend_id = Array.from(
      new Set([
        ...currentUser.friend_id.map((id) => id.toString()),
        requesterObjectId.toString(),
      ]),
    ).map((id) => new Types.ObjectId(id));

    requester.friend_id = Array.from(
      new Set([
        ...requester.friend_id.map((id) => id.toString()),
        currentUserObjectId.toString(),
      ]),
    ).map((id) => new Types.ObjectId(id));

    await currentUser.save();
    await requester.save();

    return { message: 'Friend request accepted' };
  }
  async removeFriend(currentUserId: string, friendId: string) {
    if (
      !Types.ObjectId.isValid(currentUserId) ||
      !Types.ObjectId.isValid(friendId)
    ) {
      throw new Error('Invalid userId or friendId');
    }

    const currentUser = await this.userModel.findById(currentUserId);
    const friendUser = await this.userModel.findById(friendId);

    if (!currentUser || !friendUser) {
      throw new Error('User not found');
    }

    const friendObjectId = new Types.ObjectId(friendId);
    const currentUserObjectId = new Types.ObjectId(currentUserId);

    currentUser.friend_id = currentUser.friend_id.filter(
      (id) => !id.equals(friendObjectId),
    );

    friendUser.friend_id = friendUser.friend_id.filter(
      (id) => !id.equals(currentUserObjectId),
    );

    currentUser.acceptFriend = currentUser.acceptFriend.filter(
      (id) => id !== friendId,
    );
    friendUser.acceptFriend = friendUser.acceptFriend.filter(
      (id) => id !== currentUserId,
    );

    await currentUser.save();
    await friendUser.save();

    return { message: 'Friend removed successfully' };
  }

  async rejectFriendRequest(currentUserId: string, requesterId: string) {
    const currentUser = await this.userModel.findById(currentUserId);
    if (!currentUser) {
      throw new Error('Current user not found');
    }

    if (!currentUser.acceptFriend.includes(requesterId)) {
      throw new Error('No friend request from this user to reject');
    }

    currentUser.acceptFriend = currentUser.acceptFriend.filter(
      (id) => id !== requesterId,
    );

    await currentUser.save();

    return { message: 'Friend request rejected successfully' };
  }

  async findByEmailWithInterests(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email })
      .select('-password')
      .populate('interest_id');
  }

  async requestEmailChange(userId: string, newEmail: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('Người dùng không tồn tại');

    const emailExists = await this.userModel.findOne({ email: newEmail });
    if (emailExists) throw new BadRequestException('Email mới đã được sử dụng');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await this.mailService.sendMail(
      user.email,
      'Xác nhận đổi email',
      `Mã OTP để xác nhận đổi email: ${otp}. Mã có hiệu lực trong 15 phút.`,
    );

    await this.userModel.findByIdAndUpdate(userId, {
      resetPasswordOtp: otp,
      resetPasswordOtpExpiry: expiry,
      pendingNewEmail: newEmail,
    });

    return { message: 'OTP xác nhận đã gửi đến email hiện tại' };
  }

  async confirmEmailChange(userId: string, otp: string) {
    const user = await this.userModel.findById(userId);
    if (
      !user ||
      !user.pendingNewEmail ||
      user.resetPasswordOtp !== otp ||
      !user.resetPasswordOtpExpiry ||
      new Date() > user.resetPasswordOtpExpiry
    ) {
      throw new BadRequestException('OTP không hợp lệ hoặc đã hết hạn');
    }

    user.email = user.pendingNewEmail;
    user.pendingNewEmail = undefined;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;
    await user.save();

    return { message: 'Email đã được cập nhật thành công' };
  }
}
