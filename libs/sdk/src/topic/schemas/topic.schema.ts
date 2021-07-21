import { User } from '@lib/sdk/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly userId: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true })
  readonly name: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
