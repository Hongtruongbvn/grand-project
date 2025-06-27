import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
@Schema({ timestamps: true })
export class ChatroomMember {
  @Prop({ type: Types.ObjectId, ref: 'Chatroom', required: true })
  chatroom_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['admin', 'member', 'viewer'],
    default: 'member',
  }) // enum giả định
  role: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ChatroomMemberSchema =
  SchemaFactory.createForClass(ChatroomMember);
