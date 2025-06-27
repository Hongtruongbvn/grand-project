import { Module } from '@nestjs/common';
import { ChatroomMemberService } from './chatroom-member.service';
import { ChatroomMemberController } from './chatroom-member.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatroomMember,
  ChatroomMemberSchema,
} from './schema/chatroom-member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatroomMember.name, schema: ChatroomMemberSchema },
    ]),
  ],
  controllers: [ChatroomMemberController],
  providers: [ChatroomMemberService],
  exports: [ChatroomMemberService],
})
export class ChatroomMemberModule {}
