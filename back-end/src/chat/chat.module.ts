// back-end/src/chat/chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessageModule } from 'src/message/message.module'; // Import MessageModule

@Module({
  imports: [MessageModule], // Thêm MessageModule vào đây
  providers: [ChatGateway],
})
export class ChatModule {}