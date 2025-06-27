import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chatroom')
export class ChatroomController {
  constructor(private readonly chatroomService: ChatroomService) {}
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createFriendChat(@Body('name') name: string, @Req() req: any) {
    return await this.chatroomService.createFriendChat(
      name,
      req.user.userId,
      'public',
    );
  }
}
