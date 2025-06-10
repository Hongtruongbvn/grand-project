import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  password: string;

  @Prop()
  saild: string;

  @Prop({ type: Types.ObjectId, ref: 'Role', default: 'user' })
  role_id: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  xp: number;

  @Prop({ type: Types.ObjectId, ref: 'Type', default: 'user' })
  type_id: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'Post' })
  post_id: Types.ObjectId[];

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  address: string;

  @Prop()
  birthday: Date;

  @Prop()
  influencer_id: string;

  @Prop()
  status: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Comment' })
  comments_id: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  friends_id: Types.ObjectId[];

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ type: [Types.ObjectId], ref: 'Block' })
  block_id: Types.ObjectId[];

  @Prop()
  avatar: string;

  @Prop({ type: Types.ObjectId, ref: 'Story' })
  story_id: Types.ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'Interest' })
  interest_id: Types.ObjectId[];

  @Prop()
  resetPasswordOtp?: string;

  @Prop()
  resetPasswordOtpExpiry?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
