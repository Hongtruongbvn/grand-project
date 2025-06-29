import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/message.schema';
import { Types, Model } from 'mongoose';
import { ChatroomMemberService } from 'src/chatroom-member/chatroom-member.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly chatMemberService: ChatroomMemberService,
    private readonly notificationService: NotificationService,
  ) {}
  async sendMessage(user_id: string, group_id: string, content: string) {
    const member = await this.chatMemberService.findMem(user_id, group_id);
    if (!member || !member.isActive) {
      throw new NotFoundException(
        'User is not an active member of the chatroom',
      );
    }
    const message = await this.messageModel.create({
      content,
      room_id: new Types.ObjectId(group_id),
      sender_id: new Types.ObjectId(user_id),
    });
    const users = await this.chatMemberService.userInRoom(group_id);

    const receivers = users.filter(
      (member) => member.user_id.toString() !== user_id,
    );

    await Promise.all(
      users
        .filter((member) => member.user_id.toString() !== user_id)
        .map((member) =>
          this.notificationService.createNoTi(
            'new message',
            member.user_id.toString(),
            user_id,
          ),
        ),
    );
    return message;
  }
}
