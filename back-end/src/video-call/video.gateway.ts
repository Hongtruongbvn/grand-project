// video.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @MessageBody() data: { roomId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.roomId);
    client.to(data.roomId).emit('user-joined', data.userId);
  }

  @SubscribeMessage('offer')
  handleOffer(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('offer', data);
  }

  @SubscribeMessage('answer')
  handleAnswer(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.to(data.roomId).emit('answer', data);
  }

  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit('ice-candidate', data);
  }

  @SubscribeMessage('screen-share')
  handleScreenShare(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    client.to(data.roomId).emit('screen-share', data);
  }
}
