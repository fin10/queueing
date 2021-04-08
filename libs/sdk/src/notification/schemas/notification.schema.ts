import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { NotificationType } from '../enums/notification-type.enum';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  readonly type!: NotificationType;

  @Prop({ required: true })
  readonly reference!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  readonly userId!: mongoose.Types.ObjectId;

  @Prop({ default: false })
  readonly isViewed!: boolean;

  readonly _id!: mongoose.Types.ObjectId;
  readonly createdAt!: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
