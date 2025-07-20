import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Post', required: true })
  post: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parentComment?: Types.ObjectId; // cho reply
    
  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({
  type: Map,
  of: [{ type: Types.ObjectId, ref: 'User' }],
  default: {},
  })
  reactions: Map<string, Types.ObjectId[]>;

}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
