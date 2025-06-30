import { BadRequestException, Injectable } from '@nestjs/common';
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
    console.log('[NotificationService] createNoTi called with:', {
      title,
      user_id,
      sender_id,
    });

    if (
      !Types.ObjectId.isValid(user_id) ||
      !Types.ObjectId.isValid(sender_id)
    ) {
      console.error('Invalid ObjectId:', { user_id, sender_id });
      throw new BadRequestException('Invalid user_id or sender_id');
    }

    const notification = await this.notificationModel.create({
      title,
      user_id: new Types.ObjectId(user_id),
      sender_id: new Types.ObjectId(sender_id),
      isRead: false,
      createdAt: new Date(),
    });

    console.log(
      '[NotificationService] Notification created:',
      notification._id,
    );
    return notification;
  }

  async detectNotification(id: string): Promise<Notification | null> {
    return this.notificationModel.findById(id).exec();
  }
}
