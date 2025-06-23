import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schema/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}
  async createNoTi(title: string, user_id: string, sender_id: string) {
    const notification = new CreateNotificationDto();
    notification.title = title;
    notification.user_id = user_id;
    notification.sender_id = sender_id;

    return await this.notificationModel.create({
      title: notification.title,
      user_id: new Types.ObjectId(notification.user_id),
      sender_id: new Types.ObjectId(notification.sender_id),
      isRead: false,
    });
  }

  async detectNotification(id: string): Promise<Notification | null> {
    return this.notificationModel.findById(id).exec();
  }
}
