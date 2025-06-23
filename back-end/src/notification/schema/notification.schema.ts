import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Notification extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ required: true, default: 'new message' }) // enum giả định
  title: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  sender_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post' })
  post_id: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
