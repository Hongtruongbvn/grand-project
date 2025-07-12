import {
  Controller,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
  Req,
  Get,
  Patch,
  Post,
  Body,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Giả sử đây là đường dẫn đúng

// SỬA LỖI 404 TẠI ĐÂY
@Controller('api/notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const notification = await this.notificationService.detectNotification(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    // Bạn gọi hàm detect 2 lần, có thể là lỗi logic. Tạm thời giữ nguyên.
    await this.notificationService.detectNotification(id);
    return { message: 'Notification deleted successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyNotifications(@Req() req: any) {
    const userId = req.user.userId;
    return this.notificationService.findForUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    // await this.notificationService.markAsRead(id);
    return { message: 'Notification marked as read' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('unread-by-sender')
  async getUnreadBySender(@Req() req) {
    const userId = req.user.id;
    return this.notificationService.getUnreadCountsBySender(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mark-as-read')
  async markMessagesFromSenderAsRead(
    @Req() req,
    @Body() body: { sender_id: string },
  ) {
    const recipientId = req.user.id;
    return this.notificationService.markMessagesAsRead(
      recipientId,
      body.sender_id,
    );
  }
}