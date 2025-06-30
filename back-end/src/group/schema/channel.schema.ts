import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Channel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  group_id: Types.ObjectId;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);
