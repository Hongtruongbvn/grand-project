// back-end/src/chat/chat.gateway.ts
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'; // Chúng ta có thể dùng Guard để bảo vệ

// Cấu hình Gateway: cho phép kết nối từ frontend của bạn
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // Inject MessageService để lưu tin nhắn vào database
  constructor(private readonly messageService: MessageService) {}

  // Tạo một instance của server WebSocket để có thể gửi tin nhắn
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  // Xử lý khi có một client (người dùng) kết nối tới
  handleConnection(client: Socket) {
    this.logger.log(`Client đã kết nối: ${client.id}`);
  }

  // Xử lý khi một client ngắt kết nối
  handleDisconnect(client: Socket) {
    this.logger.log(`Client đã ngắt kết nối: ${client.id}`);
  }

  /**
   * Lắng nghe sự kiện 'joinRoom' từ client.
   * Khi người dùng mở một cửa sổ chat, họ sẽ "tham gia" vào một phòng.
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    this.logger.log(`Client ${client.id} đã tham gia phòng: ${room}`);
    // Gửi lại cho chính client đó một tin nhắn xác nhận
    client.emit('joinedRoom', `Bạn đã tham gia phòng ${room}`);
  }

  /**
   * Lắng nghe sự kiện 'sendMessage' từ client.
   * Đây là hàm xử lý chính khi có người gửi tin nhắn.
   */
  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { senderId: string; roomId: string; content: string },
  ): Promise<void> {
    try {
      this.logger.log(`Nhận được tin nhắn từ phòng ${payload.roomId}: ${payload.content}`);
      
      // 1. Lưu tin nhắn vào database sử dụng MessageService
      const message = await this.messageService.sendMessage(
        payload.senderId,
        payload.roomId,
        payload.content,
      );

      // 2. Gửi tin nhắn đó đến TẤT CẢ mọi người trong cùng phòng chat
      this.server.to(payload.roomId).emit('newMessage', message);
      
      // 3. Logic Chatbot đơn giản
      this.handleChatbot(payload.roomId, payload.content);

    } catch (error) {
      this.logger.error('Lỗi khi xử lý tin nhắn:', error);
      // Gửi lại lỗi cho client đã gửi tin nhắn
      client.emit('error', 'Không thể gửi tin nhắn của bạn.');
    }
  }

  /**
   * Hàm xử lý chatbot.
   */
  private handleChatbot(roomId: string, content: string) {
    // Chỉ kích hoạt bot nếu chat trong phòng đặc biệt 'chatbot-room'
    if (roomId !== 'chatbot-room') return;

    let botResponse = 'Xin lỗi, tôi chưa hiểu ý bạn. Gõ "help" để xem các lệnh.';

    if (content.toLowerCase().includes('help')) {
        botResponse = 'Các lệnh bạn có thể dùng: "hello", "time", "joke".';
    } else if (content.toLowerCase().includes('hello')) {
        botResponse = 'Xin chào! Tôi là trợ lý ảo của bạn.';
    } else if (content.toLowerCase().includes('time')) {
        botResponse = `Bây giờ là ${new Date().toLocaleTimeString('vi-VN')}.`;
    } else if (content.toLowerCase().includes('joke')) {
        botResponse = 'Tại sao con gà lại đi qua đường? Để sang bên kia đường!';
    }
    
    // Giả lập bot đang "suy nghĩ" rồi gửi lại tin nhắn
    setTimeout(() => {
        const botMessage = {
            sender_id: { _id: 'BOT_ID', username: 'ChatBot', avatar: '/bot-avatar.png' },
            content: botResponse,
            room_id: roomId,
            createdAt: new Date().toISOString(),
        };
        this.server.to(roomId).emit('newMessage', botMessage);
    }, 1000);
  }
}