import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RawTopicDocument = RawTopic & Document;

@Schema({ timestamps: true })
export class RawTopic {
  @Prop({ required: true, unique: true })
  readonly name!: string;

  readonly _id!: string;
}

export const RawTopicSchema = SchemaFactory.createForClass(RawTopic);
