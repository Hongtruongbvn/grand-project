import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class GroupRole {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [String], default: [] })
  access: string[];

  // === SỬA LỖI Ở ĐÂY: Bỏ required: true ===
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Group' })
  group_id?: Types.ObjectId; // Thêm `?` để đánh dấu là optional

  @Prop()
  color: string;
}

export type GroupRoleDocument = HydratedDocument<GroupRole>;
export const GroupRoleSchema = SchemaFactory.createForClass(GroupRole);