import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GlobalRoleService } from 'src/global-role/global-role.service';
import { InterestService } from 'src/interest/interest.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly globalRoleService: GlobalRoleService,
    private readonly interestService: InterestService,
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

  async findById(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
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
}
