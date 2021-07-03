import { User } from '@lib/sdk/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RawTopicDocument = RawTopic & Document;

@Schema({ timestamps: true })
export class RawTopic {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly userId: mongoose.Types.ObjectId;

  @Prop({ required: true, unique: true, trim: true })
  readonly name: string;

  readonly _id: string;

  readonly count?: number;
}

export const RawTopicSchema = SchemaFactory.createForClass(RawTopic);
