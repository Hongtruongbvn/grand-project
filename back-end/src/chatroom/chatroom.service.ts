import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chatroom } from './schema/chatroom.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel(Chatroom.name) private chatroomModel: Model<Chatroom>,
  ) {}
  async createFriendChat(name: string, owner: string, type: string) {
    const chatroom = new this.chatroomModel({
      name,
      owner: new Types.ObjectId(owner),
      type,
    });

    const newchat = await chatroom.save();
    return newchat;
  }
  async findOne(id: string) {
    const find = await this.chatroomModel.findById(id);
    if (!find) {
      throw new NotFoundException('not found this chat room');
    }
    return find;
  }
  async isOwner(user_id: string, group_id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(user_id) || !Types.ObjectId.isValid(group_id)) {
      throw new NotFoundException('Invalid user_id or group_id');
    }

    const chatroom = await this.chatroomModel.findById(group_id).exec();

    if (!chatroom) {
      throw new NotFoundException('Chatroom not found');
    }

    return chatroom.owner.toString() === user_id;
  }
}
