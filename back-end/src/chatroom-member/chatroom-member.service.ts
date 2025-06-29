import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatroomMember } from './schema/chatroom-member.schema';
import { Model, Types } from 'mongoose';
import { ChatroomService } from 'src/chatroom/chatroom.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ChatroomMemberService {
  constructor(
    @InjectModel(ChatroomMember.name)
    private chatMemberModel: Model<ChatroomMember>,
    private readonly chatRoomService: ChatroomService,
    private readonly notificationService: NotificationService,
  ) {}
  async addMember(chatroom_id: string, user_id: string, role) {
    const member = new this.chatMemberModel({
      chatroom_id: new Types.ObjectId(chatroom_id),
      user_id: new Types.ObjectId(user_id),
      role,
    });
    return await member.save();
  }
  async banMember(user_id: string, memberId: string, chatroom_id: string) {
    const member = await this.chatMemberModel.findOne({
      user_id: new Types.ObjectId(memberId),
      chatroom_id: new Types.ObjectId(chatroom_id),
    });
    const banner = await this.chatMemberModel.findOne({
      user_id: new Types.ObjectId(user_id),
      chatroom_id: new Types.ObjectId(chatroom_id),
    });
    if (banner?.role != 'admin') {
      throw new NotFoundException('you do not have enough rights');
    }
    if (!member) {
      throw new NotFoundException('Member not found in chatroom');
    }

    if (!member.isActive) {
      return { message: 'Member is already banned or inactive.' };
    }
    member.isActive = false;
    await member.save();

    return { message: 'Member banned successfully' };
  }
  async sendRequest(
    chatroom_id: string,
    sender_id: string,
    receiver_id: string,
  ) {
    const chatroom = await this.chatRoomService.findOne(chatroom_id);
    const notification = await this.notificationService.createNoTi(
      'new request join chatRoom',
      receiver_id,
      sender_id,
    );
  }
  async atpRequest(user_id: string, group_id) {
    const member = new this.chatMemberModel({
      chatroom_id: new Types.ObjectId(group_id),
      user_id: new Types.ObjectId(user_id),
      role: 'member',
    });

    return await member.save();
  }
  async findMem(user_id: string, group_id: string) {
    const find = await this.chatMemberModel.findOne({
      user_id: new Types.ObjectId(user_id),
      chatroom_id: new Types.ObjectId(group_id),
    });
    if (!find) {
      throw new BadRequestException('not found this member');
    }
    return find;
  }
  async userInRoom(room_id: string) {
    const members = await this.chatMemberModel
      .find({ chatroom_id: room_id, isActive: true })
      .populate('user_id') // populate nếu cần
      .exec();

    return members;
  }
}
