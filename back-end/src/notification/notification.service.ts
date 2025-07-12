import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from './schema/notification.schema';
import { Message } from '../message/schema/message.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
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

  // Nam Thêm
  async findForUser(userId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ user_id: userId })
      .populate('sender_id', 'username avatar') // Lấy thông tin người gửi
      .sort({ createdAt: -1 }) // Sắp xếp mới nhất lên trên
      .limit(20) // Giới hạn 20 thông báo
      .exec();
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.updateOne(
      { _id: notificationId },
      { isRead: true },
    );
  }

  async getUnreadCountsBySender(userId: string) {
    const results = await this.messageModel.aggregate([
      // Logic của bạn đã đúng, giờ nó sẽ chạy được
      { $match: { receiver_id: userId, read: false } },
      { $group: { _id: '$sender_id', count: { $sum: 1 } } },
    ]);

    const counts = results.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return { counts };
  }

  // Đổi tên hàm này cho khớp với controller
  async markMessagesAsRead(recipientId: string, senderId: string) {
    await this.messageModel.updateMany(
      { receiver_id: recipientId, sender_id: senderId, read: false },
      { $set: { read: true } },
    );
    return { message: 'success' };
  }
}
