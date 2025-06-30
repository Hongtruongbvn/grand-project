import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop()
  salt: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 0 })
  xp: number;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  avatar: string;

  @Prop()
  address: string;

  @Prop()
  birthday: Date;

  @Prop({ default: true })
  status: boolean;

  @Prop({ type: Types.ObjectId, ref: 'GlobalRole' })
  global_role_id: Types.ObjectId;

  @Prop({ default: false })
  hideProfile: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Notification' })
  notification: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Type' })
  type_id: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Interest', default: [] }) //sửa cho hiện nhiều sở thích thay vì 1
  interest_id: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  friend_id: Types.ObjectId[];


  @Prop()
  acceptFriend: string[];

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop()
  resetPasswordOtp?: string;

  @Prop()
  resetPasswordOtpExpiry?: Date;

  @Prop()
  pendingNewEmail?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
