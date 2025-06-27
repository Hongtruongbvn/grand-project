import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatroomMemberService } from './chatroom-member.service';
import { CreateChatroomMemberDto } from './dto/create-chatroom-member.dto';
import { UpdateChatroomMemberDto } from './dto/update-chatroom-member.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('chatroom-member')
export class ChatroomMemberController {
  constructor(private readonly chatroomMemberService: ChatroomMemberService) {}
  @UseGuards(JwtAuthGuard)
  @Post('ban/:id/:groupdid')
  async BanerUser(
    @Param('chatroomId') chatroomId: string,
    @Param('memberId') memberId: string,
    @Req() req: any,
  ) {
    return await this.BanerUser(req.user.userId, chatroomId, memberId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('send/:userId/:groupId')
  async SendRequest(
    @Param('userId') userId: string,
    @Param('groupId') groupId: string,
    @Req() req: any,
  ) {
    return await this.SendRequest(groupId, userId, req.user.userId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('atp/:groupId')
  async atpRequest(@Param('groupId') groupId: string, @Req() req: any) {
    return await this.atpRequest(req.user.userId, groupId);
  }
}
