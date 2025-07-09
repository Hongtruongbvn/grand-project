import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('message')
@UseGuards(JwtAuthGuard) // Áp dụng Guard cho toàn bộ controller
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('send') // Route: POST /message/send
  async sendMessage(
    @Req() req: any,
    @Body('roomId') roomId: string, // Đổi tên cho rõ nghĩa
    @Body('content') content: string,
  ) {
    return this.messageService.sendMessage(req.user.userId, roomId, content);
  }

  @Get(':roomId') // Route: GET /message/ID_PHONG_CHAT
  async getMessages(@Param('roomId') roomId: string) {
    return this.messageService.getMessages(roomId);
  }
}