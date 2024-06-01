import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReportType } from '../models/report-type.model';
import { ReportStatus } from '../models/report-status.model';

export type ReportDocument = HydratedDocument<Report>;

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true, trim: true })
  content: string;

  @Prop({ required: true })
  tags: string[];

  @Prop({ required: true })
  reportedElementId: string;

  @Prop({ type: Date })
  revisionDate?: Date;

  @Prop({ required: true, enum: ReportType })
  type: ReportType;

  @Prop({ enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewer: Types.ObjectId;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
