import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class GroupMember {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group', required: true })
  group_id: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'GroupRole',
  })
  group_role_id: Types.ObjectId;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  joinedAt: Date;
}

export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);
