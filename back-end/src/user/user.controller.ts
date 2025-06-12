import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  Request,
  BadRequestException,
  HttpException,
  HttpStatus,
  Query,
  Param,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';

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
  @Get('find/email')
  async getUserByEmail(@Query('email') email: string) {
    if (!email) {
      throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
    }
    return this.userService.findByEmail(email);
  }
  @Get('find/gender/:gender')
  async getUsersByGender(@Param('gender') gender: string) {
    if (!['male', 'female', 'other'].includes(gender)) {
      throw new HttpException('Invalid gender value', HttpStatus.BAD_REQUEST);
    }
    return this.userService.findByGender(gender as 'male' | 'female' | 'other');
  }
  @Get('find/interest') //http:localhost:9090/users/find/interest?ids=665fc03109cc9925f82473a1,665fc03109cc9925f82473a2,665fc03109cc9925f82473a3
  async getUsersByInterest(@Query('ids') ids: string) {
    if (!ids) {
      throw new HttpException(
        'hãy thử users/find/interest?ids=665fc03109cc9925f82473a1,665fc03109cc9925f82473a2,',
        HttpStatus.BAD_REQUEST,
      );
    }
    const idArray = ids.split(',').filter((id) => Types.ObjectId.isValid(id));
    if (idArray.length === 0) {
      throw new HttpException(
        'No valid interest IDs provided',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.findByInterestIds(
      idArray.map((id) => new Types.ObjectId(id)),
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('friend/request/:toUserId')
  async sendFriendRequest(
    @Param('toUserId') toUserId: string,
    @Request() req: any,
  ) { 
    const fromUserId = req.user.userId; // 👈 lấy userId hiện tại từ token
    return this.userService.sendFriendRequest(fromUserId, toUserId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('friend/accept/:requesterId')
  async acceptFriendRequest(
    @Param('requesterId') requesterId: string,
    @Req() req: any,
  ) {
    return this.userService.acceptFriendRequest(req.user.userId, requesterId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('friend/reject/:requesterId')
  async rejectFriendRequest(
    @Param('requesterId') requesterId: string,
    @Req() req: any,
  ) {
    return this.userService.rejectFriendRequest(req.user.userId, requesterId);
  }
}
