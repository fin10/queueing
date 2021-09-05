import { User } from '@lib/sdk/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ReportType } from '../enums/report-type.enum';
import { ReportingTargetType } from '../enums/reporting-target-type.enum';

export type ReportingDocument = Reporting & Document;

@Schema({ timestamps: true })
export class Reporting {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly reporterId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String, enum: Object.values(ReportType), get: (v: string) => v as ReportType })
  readonly type: ReportType;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(ReportingTargetType),
    get: (v: string) => v as ReportingTargetType,
  })
  readonly targetType: ReportingTargetType;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  readonly targetId: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly targetUserId: mongoose.Types.ObjectId;
}

export const ReportingSchema = SchemaFactory.createForClass(Reporting);
