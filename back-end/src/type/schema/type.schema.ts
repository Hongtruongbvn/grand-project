// schemas/type.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Type extends Document {
  @Prop({ required: true, default: 'user' })
  name: string;

  @Prop({ required: true, default: 0 })
  price: number;
}

export const TypeSchema = SchemaFactory.createForClass(Type);
