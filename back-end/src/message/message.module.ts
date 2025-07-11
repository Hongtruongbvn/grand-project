import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schema/message.schema';
import { ChatroomMemberModule } from 'src/chatroom-member/chatroom-member.module';
import { NotificationModule } from 'src/notification/notification.module';
import { ChatroomModule } from 'src/chatroom/chatroom.module';
import { BlockModule } from 'src/block/block.module';

@Module({
  imports: [
    BlockModule,
    ChatroomModule,
    NotificationModule,
    ChatroomMemberModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
