// back-end/src/message/message.service.ts

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import { Types, Model } from 'mongoose';
import { NotificationService } from 'src/notification/notification.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { BlockService } from 'src/block/block.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
    private readonly notificationService: NotificationService,
    private readonly chatroomService: ChatroomService,
    private readonly blockService: BlockService,
  ) {}

  /**
   * === HÀM SENDMESSAGE ĐÃ ĐƯỢC SỬA LỖI HOÀN CHỈNH ===
   */
  async sendMessage(
    senderId: string,
    roomId: string,
    content: string,
  ): Promise<MessageDocument> {
    if (!Types.ObjectId.isValid(senderId) || !Types.ObjectId.isValid(roomId)) {
      throw new BadRequestException(
        'ID người dùng hoặc ID phòng chat không hợp lệ',
      );
    }

    // === SỬA LỖI Ở ĐÂY: Gọi đúng hàm findById ===
    // Trước đó là findOne, gây ra lỗi.
    const room = await this.chatroomService.findById(roomId);
    if (!room) {
      throw new NotFoundException('Không tìm thấy phòng chat.');
    }
    const senderObjectId = new Types.ObjectId(senderId);
    const isBlocked = await this.blockService.isInBlockList(
      room.owner.toString(),
      senderId,
    );
    if (isBlocked) {
      const blocked = await this.notificationService.createNoTi(
        'bạn đã bị người dùng náy chặn',
        room.owner.toString(),
        senderId,
      );
      throw new ForbiddenException('Bạn đã bị block. Không thể gửi tin nhắn.');
    }
    const isMember = room.members.some((memberId) =>
      memberId.equals(senderObjectId),
    );
    if (!isMember) {
      throw new ForbiddenException(
        'Bạn không phải là thành viên của phòng chat này.',
      );
    }

    // Tạo và lưu tin nhắn
    const message = await this.messageModel.create({
      content,
      room_id: new Types.ObjectId(roomId),
      sender_id: senderObjectId,
    });

    // Populate thông tin người gửi để gửi qua socket
    const populatedMessage = await message.populate({
      path: 'sender_id',
      select: 'username avatar',
    });

    // Gửi thông báo đến các thành viên khác trong phòng
    const recipients = room.members.filter(
      (memberId) => !memberId.equals(senderObjectId),
    );

    await Promise.all(
      recipients.map((toUserId) =>
        this.notificationService.createNoTi(
          `bạn có tin nhắn mới từ ${(populatedMessage.sender_id as any).username}`, // Cải thiện nội dung thông báo
          toUserId.toString(),
          senderId,
        ),
      ),
    );

    return populatedMessage;
  }

  async getMessages(roomId: string): Promise<MessageDocument[]> {
    return this.messageModel
      .find({ room_id: new Types.ObjectId(roomId) })
      .populate('sender_id', 'username avatar')
      .sort({ createdAt: 'asc' }) // Sắp xếp từ cũ đến mới
      .exec();
  }
}
