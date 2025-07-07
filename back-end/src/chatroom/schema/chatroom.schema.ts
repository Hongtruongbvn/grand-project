import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chatroom {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['public', 'private', 'group'],
    default: 'private',
  })
  type: 'public' | 'private' | 'group';

  // === THÊM TRƯỜNG QUAN TRỌNG NÀY VÀO ===
  // Lưu danh sách ID của tất cả thành viên trong phòng chat
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  members: Types.ObjectId[];
}

export type ChatroomDocument = HydratedDocument<Chatroom>;
export const ChatroomSchema = SchemaFactory.createForClass(Chatroom);