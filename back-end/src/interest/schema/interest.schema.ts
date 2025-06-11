// schemas/interest.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Interest extends Document {
  @Prop({ required: true, default: 'sở thích' })
  name: string;

  @Prop({ required: true })
  type: string;
}

export const InterestSchema = SchemaFactory.createForClass(Interest);
