import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatroomMemberService } from './chatroom-member.service';
import { CreateChatroomMemberDto } from './dto/create-chatroom-member.dto';
import { UpdateChatroomMemberDto } from './dto/update-chatroom-member.dto';

@Controller('chatroom-member')
export class ChatroomMemberController {
  constructor(private readonly chatroomMemberService: ChatroomMemberService) {}

  @Post()
  create(@Body() createChatroomMemberDto: CreateChatroomMemberDto) {
    return this.chatroomMemberService.create(createChatroomMemberDto);
  }

  @Get()
  findAll() {
    return this.chatroomMemberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatroomMemberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatroomMemberDto: UpdateChatroomMemberDto) {
    return this.chatroomMemberService.update(+id, updateChatroomMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatroomMemberService.remove(+id);
  }
}
