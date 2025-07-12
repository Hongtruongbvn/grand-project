import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  shortVideo?: string;

  @Prop({ type: [String], default: [] })
  mediaUrls?: string[];

  @Prop({ enum: ['text', 'video', 'mixed'], required: true })
  type: 'text' | 'video' | 'mixed';

  @Prop({ enum: ['public', 'friends', 'private'], default: 'public' })
  visibility: 'public' | 'friends' | 'private';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
