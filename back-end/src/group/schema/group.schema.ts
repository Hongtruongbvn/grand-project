import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose'; // Import HydratedDocument

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

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Interest', default: [] })
  interest_id: Types.ObjectId[];
  
  // Các trường này có thể không cần nữa vì logic đã chuyển sang GroupMember
  // Nhưng tôi giữ lại để tránh lỗi nếu bạn có dùng ở nơi khác
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  pending_members: Types.ObjectId[];
  
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  baned_members: Types.ObjectId[];
}

// === SỬA LỖI: Dùng HydratedDocument ===
export type GroupDocument = HydratedDocument<Group>;
export const GroupSchema = SchemaFactory.createForClass(Group);