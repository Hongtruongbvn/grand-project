import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatroomMemberService } from './chatroom-member.service';
import { CreateChatroomMemberDto } from './dto/create-chatroom-member.dto';
import { UpdateChatroomMemberDto } from './dto/update-chatroom-member.dto';

@Controller('chatroom-member')
export class ChatroomMemberController {
  constructor(private readonly chatroomMemberService: ChatroomMemberService) {}
}
