import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String }) 
  shortVideo?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: String, enum: ['text', 'video', 'mixed'], required: true })
  type: 'text' | 'video' | 'mixed';
}
export type PostDocument = Post & Document;

export const PostSchema = SchemaFactory.createForClass(Post);
