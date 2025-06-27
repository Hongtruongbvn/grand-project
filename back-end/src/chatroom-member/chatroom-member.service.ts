import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatroomMember } from './schema/chatroom-member.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ChatroomMemberService {
  constructor(
    @InjectModel(ChatroomMember.name)
    private chatMemberModel: Model<ChatroomMember>,
  ) {}
  async addMember(chatroom_id: string, user_id: string, role) {
    const member = new this.chatMemberModel({
      chatroom_id: new Types.ObjectId(chatroom_id),
      user_id: new Types.ObjectId(user_id),
      role,
    });
    return await member.save();
  }
}
