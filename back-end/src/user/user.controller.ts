import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    try {
      const user = await this.userService.register(dto);
      return { message: 'Đăng ký thành công', data: user };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException('Lỗi đăng ký người dùng');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    const user = await this.userService.findById(req.user.userId);
    return { message: 'Lấy thông tin người dùng thành công', data: user };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/update')
  async updateMyProfile(@Request() req, @Body() updateDto: UpdateUserDto) {
    const user = await this.userService.updateProfile(
      req.user.userId,
      updateDto,
    );
    return { message: 'Cập nhật hồ sơ thành công', data: user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('set/role/user')
  async setUserRole(@Request() req) {
    const result = await this.userService.setDefaultRole(req.user.userId);
    return { message: 'Gán vai trò thành công', data: result };
  }
  @UseGuards(JwtAuthGuard)
  @Post('set/interests')
  async setInterests(
    @Request() req: any,
    @Body() dto: { interestIds: string[] },
  ) {
    const result = await this.userService.addInterestsToUser(
      req.user.userId,
      dto.interestIds,
    );
    return { message: 'Cập nhật sở thích thành công', data: result };
  }
}
