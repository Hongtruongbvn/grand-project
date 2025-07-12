import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema'; // Import UserDocument
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/mail/mail.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private mailService: MailService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).populate('interest_id').exec();
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload = {
      sub: user._id,
      username: user.username,
      role: user.global_role_id,
      userId: user._id, // Thêm userId vào payload để khớp với code cũ của bạn
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id.toString(), // Trả về _id
        username: user.username,
        email: user.email,
        role: user.global_role_id,
        interest_id: user.interest_id ?? [],
      },
    };
  }

  async sendResetOtp(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('Email không tồn tại');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await this.userService.updateResetPasswordOtp(email, otp, expiry);
    const subject = 'Mã xác nhận đặt lại mật khẩu';
    const text = `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 15 phút.`;
    await this.mailService.sendMail(email, subject, text);

    return { message: 'Mã OTP đã được gửi đến email' };
  }
  
  // ... các hàm khác giữ nguyên ...
  async verifyOtpAndGenerateToken(email: string, otp: string) {
    const user = await this.userService.findByEmail(email);
    if (
      !user ||
      !user.resetPasswordOtp ||
      user.resetPasswordOtp !== otp ||
      !user.resetPasswordOtpExpiry ||
      user.resetPasswordOtpExpiry < new Date()
    ) {
      throw new BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn');
    }

    const payload = { email };
    const resetToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    return { resetToken };
  }

  async resetPasswordWithToken(
    email: string,
    resetToken: string,
    newPassword: string,
  ) {
    try {
      const payload = this.jwtService.verify(resetToken, {
        secret: process.env.JWT_SECRET,
      });
      if (payload.email !== email)
        throw new BadRequestException('Token không hợp lệ');
    } catch {
      throw new BadRequestException('Token hết hạn hoặc không hợp lệ');
    }

    await this.userService.updatePassword(email, newPassword);
    return { message: 'Đổi mật khẩu thành công' };
  }
}