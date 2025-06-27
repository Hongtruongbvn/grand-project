import { Injectable } from '@nestjs/common';
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
}
