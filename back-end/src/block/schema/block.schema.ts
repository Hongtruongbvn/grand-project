// src/block/block.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Block extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', required: true })
  blocked_id: Types.ObjectId[];
}

export const BlockSchema = SchemaFactory.createForClass(Block);
