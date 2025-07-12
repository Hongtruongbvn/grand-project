// back-end/src/chatroom/chatroom.service.ts
import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chatroom, ChatroomDocument } from './schema/chatroom.schema';
import { Model, Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { UserDocument } from 'src/user/schema/user.schema';
import { ChatroomMemberService } from '../chatroom-member/chatroom-member.service';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel(Chatroom.name) private chatroomModel: Model<ChatroomDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly chatroomMemberService: ChatroomMemberService,
  ) {}

  async findById(id: string): Promise<ChatroomDocument> {
    const chatroom = await this.chatroomModel.findById(id).exec();
    if (!chatroom) {
      throw new NotFoundException(`Không tìm thấy phòng chat với ID: ${id}`);
    }
    return chatroom;
  }

  async createChatroom(
    name: string,
    ownerId: string,
    type: 'private' | 'group' | 'public',
    initialMembers: string[] = [],
  ): Promise<ChatroomDocument> {
    const chatroom = new this.chatroomModel({
      name,
      owner: new Types.ObjectId(ownerId),
      type,
      members: initialMembers.map((id) => new Types.ObjectId(id)),
    });
    return await chatroom.save();
  }

  async findOrCreatePrivateChat(
    userId1: string,
    userId2: string,
  ): Promise<ChatroomDocument> {
    const members = [new Types.ObjectId(userId1), new Types.ObjectId(userId2)];

    const existingChatroom = await this.chatroomModel
      .findOne({
        type: 'private',
        members: { $all: members, $size: 2 },
      })
      .exec();

    if (existingChatroom) {
      return existingChatroom;
    }

    const user1 = await this.userService.findById(userId1);
    const user2 = await this.userService.findById(userId2);
    if (!user1 || !user2)
      throw new NotFoundException('Không tìm thấy người dùng.');

    return this.createChatroom(`Private chat`, userId1, 'private', [
      userId1,
      userId2,
    ]);
  }

async findForUser(userId: string): Promise<any[]> {
    const userObjectId = new Types.ObjectId(userId);

    const chatrooms = await this.chatroomModel.find({ members: userObjectId })
      .populate<{ members: UserDocument[] }>({ // Ép kiểu để TypeScript hiểu
        path: 'members',
        select: 'username avatar' // Chỉ lấy các trường cần thiết
      })
      .sort({ updatedAt: -1 })
      .exec();
      
    return chatrooms.map(room => {
      // Bây giờ, `room.members` là một mảng các đối tượng User đầy đủ
      const roomObject = room.toObject();
      
      let finalName = room.name;
      let finalAvatar = '/group-avatar.png'; // Avatar mặc định

      if (room.type === 'private') {
        // Tìm người còn lại trong phòng chat
        const otherUser = room.members.find(
          (mem) => mem._id.toString() !== userId
        );
        
        if (otherUser) {
          finalName = otherUser.username;
          finalAvatar = otherUser.avatar;
        }
      }
      
      // Trả về một đối tượng sạch, có cấu trúc rõ ràng cho frontend
      return {
        _id: room._id,
        name: finalName,
        avatar: finalAvatar,
        type: room.type,
      };
    });
  }
}
