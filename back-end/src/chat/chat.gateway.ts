

import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from '../message/message.service';
import { UserService } from '../user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Trong production, nên đổi thành URL của frontend
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // Xử lý khi có người dùng kết nối
  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) throw new Error('No token provided');

      const payload = await this.jwtService.verify(token);
      client['user'] = payload;

      // GỌI HÀM ĐÃ SỬA: Dòng này giờ sẽ hoạt động vì UserService đã có hàm updateStatus
      await this.userService.updateStatus(payload.userId, true);

      this.logger.log(`Client connected: ${client.id} - UserID: ${payload.userId}`);
    } catch (error) {
      this.logger.error(`Authentication error: ${error.message}`);
      client.disconnect();
    }
  }

  // Xử lý khi người dùng ngắt kết nối
  async handleDisconnect(client: Socket) {
    try {
      if (client['user']) {
        const userId = client['user'].userId;
        // GỌI HÀM ĐÃ SỬA: Dòng này cũng sẽ hoạt động
        await this.userService.updateStatus(userId, false);
        this.logger.log(`Client disconnected: ${client.id} - UserID: ${userId}`);
      }
    } catch (error) {
      this.logger.error(`Error on disconnect: ${error.message}`);
    }
  }

  // Lắng nghe sự kiện "joinRoom" từ client
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, channelId: string): void {
    client.join(channelId);
    this.logger.log(`User ${client['user']?.userId} joined room: ${channelId}`);
  }

  // Lắng nghe sự kiện "leaveRoom" từ client (Thêm vào cho đầy đủ)
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, channelId: string): void {
    client.leave(channelId);
    this.logger.log(`User ${client['user']?.userId} left room: ${channelId}`);
  }

  // Lắng nghe sự kiện "sendMessage" từ client
  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, payload: { channel_id: string; content: string }): Promise<void> {
    try {
      const user = client['user'];

      // LOGIC ĐÃ SỬA:
      // 1. Gọi hàm create từ MessageService. 
      //    Hàm này giờ đây sẽ tự động lưu và populate thông tin author.
      const populatedMessage = await this.messageService.create({
        author: user.userId,
        channel_id: payload.channel_id,
        content: payload.content,
      });

      // 2. Không cần dòng populate thừa ở đây nữa.

      // 3. Phát tin nhắn hoàn chỉnh tới tất cả mọi người trong kênh
      this.server.to(payload.channel_id).emit('newMessage', populatedMessage);
    } catch (error) {
      this.logger.error(`Error handling message: ${error.message}`);
    }
  }
}