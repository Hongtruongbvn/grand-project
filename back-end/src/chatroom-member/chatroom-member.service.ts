import { Injectable } from '@nestjs/common';
import { CreateChatroomMemberDto } from './dto/create-chatroom-member.dto';
import { UpdateChatroomMemberDto } from './dto/update-chatroom-member.dto';

@Injectable()
export class ChatroomMemberService {
  create(createChatroomMemberDto: CreateChatroomMemberDto) {
    return 'This action adds a new chatroomMember';
  }

  findAll() {
    return `This action returns all chatroomMember`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chatroomMember`;
  }

  update(id: number, updateChatroomMemberDto: UpdateChatroomMemberDto) {
    return `This action updates a #${id} chatroomMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatroomMember`;
  }
}
