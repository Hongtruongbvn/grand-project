import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/message.schema';
import { Types, Model } from 'mongoose';
import { ChatroomMemberService } from 'src/chatroom-member/chatroom-member.service';
import { NotificationService } from 'src/notification/notification.service';
import { ChatroomService } from 'src/chatroom/chatroom.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly chatMemberService: ChatroomMemberService,
    private readonly notificationService: NotificationService,
    private readonly chatroomService: ChatroomService,
  ) {}
  async sendMessage(user_id: string, group_id: string, content: string) {
    if (!Types.ObjectId.isValid(user_id) || !Types.ObjectId.isValid(group_id)) {
      throw new BadRequestException('Invalid user_id or group_id');
    }
    const member = await this.chatMemberService.findMem(user_id, group_id);

    // Nếu không phải member hoặc không active → kiểm tra xem có phải owner không
    const isOwner = await this.chatroomService.isOwner(user_id, group_id);

    if (!(member?.isActive || isOwner)) {
      throw new ForbiddenException(
        'You are neither an active member nor the owner of this chatroom',
      );
    }

    const message = await this.messageModel.create({
      content,
      room_id: new Types.ObjectId(group_id),
      sender_id: new Types.ObjectId(user_id),
    });

    const members = await this.chatMemberService.userInRoom(group_id);
    const room = await this.chatroomService.findOne(group_id);

    const receivers: string[] = [];

    for (const mem of members) {
      const uid = mem.user_id?._id?.toString();
      if (uid && uid !== user_id) {
        receivers.push(uid);
      }
    }

    const ownerId = room.owner.toString();
    if (ownerId !== user_id && !receivers.includes(ownerId)) {
      receivers.push(ownerId);
    }

    await Promise.all(
      receivers.map((toUserId) =>
        this.notificationService.createNoTi('new message', toUserId, user_id),
      ),
    );

    return message;
  }
}
