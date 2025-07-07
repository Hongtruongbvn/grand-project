import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatroomMember, ChatroomMemberDocument } from './schema/chatroom-member.schema'; // Đảm bảo schema đã export Document type
import { Model, Types } from 'mongoose';

@Injectable()
export class ChatroomMemberService {
  constructor(
    @InjectModel(ChatroomMember.name)
    private chatMemberModel: Model<ChatroomMemberDocument>,
  ) {}

  /**
   * Thêm một thành viên vào một nhóm (không phải phòng chat 1-1).
   * Logic này được gọi từ GroupService.
   */
  async addMemberToGroup(chatroom_id: string, user_id: string, role: string) {
    const member = new this.chatMemberModel({
      chatroom_id: new Types.ObjectId(chatroom_id),
      user_id: new Types.ObjectId(user_id),
      role, // Giả sử schema có trường 'role'
      isActive: true, // Mặc định là active khi được thêm vào nhóm
    });
    return await member.save();
  }

  // Các hàm khác như banMember, findMem... có thể giữ lại nếu bạn cần
  // Nhưng logic chính cho việc chat 1-1 đã được chuyển đi.
}