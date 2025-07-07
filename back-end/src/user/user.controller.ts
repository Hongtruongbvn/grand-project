// back-end/src/user/user.controller.ts

import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Patch,
  BadRequestException,
  HttpException,
  HttpStatus,
  Query,
  Param,
  NotFoundException,
  Req,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { Types } from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // =======================================================
  // ==        ROUTES KHÔNG CẦN AUTH (đặt lên trên)       ==
  // =======================================================

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

  // =======================================================
  // ==    CÁC ROUTE CỤ THỂ (ưu tiên trước route chung)   ==
  // =======================================================

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Req() req: any) {
    const user = await this.userService.findById(req.user.userId);
    // Hàm findById đã có sẵn check not found
    return { message: 'Lấy thông tin người dùng thành công', data: user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchUsers(@Query('q') query: string) {
    if (!query) {
      throw new BadRequestException('Cần cung cấp từ khóa tìm kiếm.');
    }
    return this.userService.searchByName(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status/:otherUserId')
  async getFriendshipStatus(
    @Req() req: any,
    @Param('otherUserId') otherUserId: string,
  ) {
    const currentUserId = req.user.userId;
    return this.userService.getFriendshipStatus(currentUserId, otherUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('friend/list')
  async getAllFriends(@Req() req: any) {
    return this.userService.getAllFriends(req.user.userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('friend/requests/pending')
  async getPendingRequests(@Req() req: any) {
    const currentUserId = req.user.userId;
    return this.userService.getPendingRequests(currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('friend/request/:toUserId')
  async sendFriendRequest(
    @Param('toUserId') toUserId: string,
    @Req() req: any,
  ) {
    const fromUserId = req.user.userId;
    return this.userService.sendFriendRequest(fromUserId, toUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('friend/accept/:requesterId')
  async acceptFriendRequest(
    @Param('requesterId') requesterId: string,
    @Req() req: any,
  ) {
    const currentUserId = req.user.userId;
    return this.userService.acceptFriendRequest(currentUserId, requesterId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('friend/reject/:requesterId')
  async rejectFriendRequest(
    @Param('requesterId') requesterId: string,
    @Req() req: any,
  ) {
    const currentUserId = req.user.userId;
    return this.userService.rejectFriendRequest(currentUserId, requesterId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('friend/remove/:friendId')
  async removeFriend(@Param('friendId') friendId: string, @Req() req: any) {
    const currentUserId = req.user.userId;
    return this.userService.removeFriend(currentUserId, friendId);
  }
  
  // =======================================================
  // ==           CÁC ROUTE CẬP NHẬT THÔNG TIN           ==
  // =======================================================

  @UseGuards(JwtAuthGuard)
  @Patch('me/update')
  async updateMyProfile(@Req() req: any, @Body() updateDto: UpdateUserDto) {
    const user = await this.userService.updateProfile(req.user.userId, updateDto);
    return { message: 'Cập nhật hồ sơ thành công', data: user };
  }

  @UseGuards(JwtAuthGuard)
  @Post('set/interests')
  async setInterests(@Req() req: any, @Body() dto: { interestIds: string[] }) {
    const result = await this.userService.addInterestsToUser(
      req.user.userId,
      dto.interestIds,
    );
    return { message: 'Cập nhật sở thích thành công', data: result };
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('email/request-change')
  async requestEmailChange(@Req() req: any, @Body('newEmail') newEmail: string) {
    return this.userService.requestEmailChange(req.user.userId, newEmail);
  }

  @UseGuards(JwtAuthGuard)
  @Post('email/confirm-change')
  async confirmEmailChange(@Req() req: any, @Body('otp') otp: string) {
    return this.userService.confirmEmailChange(req.user.userId, otp);
  }

  // =======================================================
  // ==      ROUTE CHUNG (phải đặt ở dưới cùng)         ==
  // =======================================================

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('ID người dùng không hợp lệ');
    }
    const user = await this.userService.findById(id);
    // Hàm findById đã có sẵn check not found, không cần check lại
    return { message: 'Lấy thông tin thành công', data: user };
  }
}