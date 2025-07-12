// src/report/report.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Report extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['spam', 'harassment', 'fake', 'other'],
    required: true,
  })
  reason: string;

  @Prop({ type: String })
  why: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporter_id: Types.ObjectId;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
