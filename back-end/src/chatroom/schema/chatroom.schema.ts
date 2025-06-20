import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chatroom extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ required: true, enum: ['public', 'private', 'group'] }) // enum giả định
  type: string;
}

export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);
