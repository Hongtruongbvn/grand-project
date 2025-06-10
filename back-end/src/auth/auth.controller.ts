import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
  @Post('send-otp')
  async sendOtp(@Body('email') email: string) {
    return this.authService.sendResetOtp(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    return this.authService.verifyOtpAndGenerateToken(body.email, body.otp);
  }

  @Post('reset')
  async resetPassword(
    @Body() body: { email: string; resetToken: string; newPassword: string },
  ) {
    return this.authService.resetPasswordWithToken(
      body.email,
      body.resetToken,
      body.newPassword,
    );
  }
}
