import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chatroom {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true, enum: ['public', 'private', 'group'] }) // enum giả định
  type: 'public' | 'private' | 'group';
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);
