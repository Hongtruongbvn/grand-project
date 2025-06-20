import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Chatroom', required: true })
  room_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender_id: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
