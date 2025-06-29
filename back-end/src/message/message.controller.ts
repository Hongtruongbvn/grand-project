import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // API này chỉ phục vụ một mục đích duy nhất:
  // Tải lịch sử tin nhắn cũ khi người dùng lần đầu tiên vào một kênh chat.
  @UseGuards(JwtAuthGuard)
  @Get('channel/:channelId')
  async getMessagesByChannel(
    @Param('channelId') channelId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
  ) {
    return this.messageService.findByChannelId(channelId, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  }

  // Chúng ta không cần API POST để gửi tin nhắn nữa.
  // Việc này sẽ được xử lý hoàn toàn bởi ChatGateway.
}
// Nam sửa
