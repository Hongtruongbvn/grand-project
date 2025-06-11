import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class GlobalRole extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  access: string[];
}

export const GlobalRoleSchema = SchemaFactory.createForClass(GlobalRole);
