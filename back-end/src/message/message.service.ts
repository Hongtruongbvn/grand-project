import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schema/message.schema';
import { Types, Model } from 'mongoose';
import { ChatroomMemberService } from 'src/chatroom-member/chatroom-member.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private readonly messageModel: Model<Message>,
    private readonly chatMemberService: ChatroomMemberService,
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

    return message;
  }


  // ===== NÂNG CẤP HÀM NÀY =====
  async create(createMessageDto: any): Promise<Message> {
    const newMessage = new this.messageModel(createMessageDto);
    // Lưu tin nhắn vào DB
    await newMessage.save();
    // Sau khi lưu, populate thông tin author và trả về
    return newMessage.populate('author', 'username avatar');// Nam Thêm
  }


    // Hàm mới để lấy tin nhắn theo kênh
  async findByChannelId(channelId: string, options: { page: number, limit: number }): Promise<Message[]> {
    const { page, limit } = options;
    return this.messageModel
      .find({ channel_id: channelId })
      .populate('author', 'username avatar') // Lấy thông tin người gửi
      .sort({ createdAt: -1 }) // Sắp xếp tin nhắn mới nhất lên đầu
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }// Nam thêm
}
