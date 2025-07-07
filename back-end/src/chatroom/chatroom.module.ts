// back-end/src/chatroom/chatroom.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chatroom, ChatroomSchema } from './schema/chatroom.schema';
import { UserModule } from 'src/user/user.module';
import { ChatroomMemberModule } from 'src/chatroom-member/chatroom-member.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chatroom.name, schema: ChatroomSchema }]),
    // Dùng forwardRef() để phá vỡ vòng lặp
    forwardRef(() => UserModule),
    forwardRef(() => ChatroomMemberModule),
  ],
  controllers: [ChatroomController],
  providers: [ChatroomService],
  exports: [ChatroomService],
})
export class ChatroomModule {}