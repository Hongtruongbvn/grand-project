import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class GroupPost {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  mediaUrls?: string[];

  @Prop()
  shortVideo?: string;

  @Prop({ enum: ['text', 'video', 'mixed'], required: true })
  type: 'text' | 'video' | 'mixed';

  @Prop({ default: false })
  isAnonymous: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  group: Types.ObjectId;
}

export type GroupPostDocument = GroupPost & Document;
export const GroupPostSchema = SchemaFactory.createForClass(GroupPost);