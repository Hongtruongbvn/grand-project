import { Controller, Param, Delete, NotFoundException } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const notification = await this.notificationService.detectNotification(id);
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    await this.notificationService.detectNotification(id);
    return { message: 'Notification deleted successfully' };
  }
}
