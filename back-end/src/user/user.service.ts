import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';



@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const hash = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hash,
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateResetPasswordOtp(email: string, otp: string | null, expiry: Date | null) {
    return this.userModel.updateOne(
      { email },
      { resetPasswordOtp: otp, resetPasswordOtpExpiry: expiry },
    );
  }

  async updatePassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.userModel.updateOne(
      { email },
      { password: hashedPassword, resetPasswordOtp: null, resetPasswordOtpExpiry: null },
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
  return this.findById(userId); // Trả lại user mới sau cập nhật
}

}
