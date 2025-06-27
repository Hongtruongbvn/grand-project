import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @UseGuards(JwtAuthGuard)
  @Post('message/send')
  async sendMessage(
    @Req() req: any,
    @Body('group_id') group_id: string,
    @Body('content') content: string,
  ) {
    return this.messageService.sendMessage(req.user.userId, group_id, content);
  }
}
