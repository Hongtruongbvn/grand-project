import { Controller, Post, Body, Req, UseGuards, BadRequestException, Get } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chatroom')
@UseGuards(JwtAuthGuard) // Áp dụng Guard cho toàn bộ controller
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}
  
  @Get('my-rooms')
  async getMyRooms(@Req() req: any) {
    const userId = req.user.userId;
    return this.chatroomService.findForUser(userId);
  }

  @Post('find-or-create')
  async findOrCreatePrivateChat(
    @Req() req: any,
    @Body('otherUserId') otherUserId: string,
  ) {
    const currentUserId = req.user.userId;
    if (!otherUserId) {
      throw new BadRequestException('otherUserId là bắt buộc');
    }
    return this.chatroomService.findOrCreatePrivateChat(currentUserId, otherUserId);
  }
}