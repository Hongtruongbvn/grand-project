import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Notification' }] })
  notification: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Type' }] })
  type_id: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Interest', default: [] })
  interest_id: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friend_id: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  acceptFriend: Types.ObjectId[];

  @Prop({ required: true, enum: ['male', 'female', 'other'] })
  gender: string;

  @Prop()
  resetPasswordOtp?: string;

  @Prop()
  resetPasswordOtpExpiry?: Date;

  @Prop()
  pendingNewEmail?: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);