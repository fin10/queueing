import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type RawTopicDocument = RawTopic & Document;

@Schema({ timestamps: true })
export class RawTopic {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly user!: string;

  @Prop({ required: true, unique: true, trim: true })
  readonly name!: string;

  readonly _id!: string;

  readonly count?: number;
}

export const RawTopicSchema = SchemaFactory.createForClass(RawTopic);
