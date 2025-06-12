import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class GroupRole {
  @Prop({ required: true, default: 'member' })
  name: string;

  @Prop({ type: [String], default: [] })
  access: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group', required: true })
  group_id: Types.ObjectId;

  @Prop()
  color: string;
}

export const GroupRoleSchema = SchemaFactory.createForClass(GroupRole);
