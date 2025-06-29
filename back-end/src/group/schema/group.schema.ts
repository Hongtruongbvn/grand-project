import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// SỬA LỖI: Thêm `Document` vào dòng import từ mongoose
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

// ======================= PHẦN CHANNEL =======================
@Schema({ timestamps: true })
export class Channel extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Group', required: true })
  group_id: Types.ObjectId;
}

export const ChannelSchema = SchemaFactory.createForClass(Channel);

// ======================= PHẦN GROUP =======================
@Schema({ timestamps: true })
export class Group extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  members: Types.ObjectId[];

  // Dòng này bây giờ sẽ hoạt động hoàn hảo
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Channel' }], default: [] })
  channels: Types.ObjectId[];

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  banned_members: Types.ObjectId[];

  @Prop()
  reason: string;

  @Prop()
  bannedAt: Date;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Interest', default: [] })
  interest_id: Types.ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
