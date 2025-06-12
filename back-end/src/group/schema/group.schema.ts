import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  members: Types.ObjectId[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  baned_members: Types.ObjectId[];

  @Prop()
  reason: string;

  @Prop()
  bannedAt: Date;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Interest', default: [] })
  interest_id: Types.ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
