import { forwardRef, Module } from '@nestjs/common';
import { ChatroomMemberService } from './chatroom-member.service';
import { ChatroomMemberController } from './chatroom-member.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChatroomMember,
  ChatroomMemberSchema,
} from './schema/chatroom-member.schema';
import { UserModule } from 'src/user/user.module';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    NotificationModule,
    ChatroomModule,
    MongooseModule.forFeature([
      { name: ChatroomMember.name, schema: ChatroomMemberSchema },
    ]),
  ],
  controllers: [ChatroomMemberController],
  providers: [ChatroomMemberService],
  exports: [ChatroomMemberService],
})
export class ChatroomMemberModule {}
