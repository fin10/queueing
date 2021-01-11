import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RawTopicDocument = RawTopic & Document;

@Schema({ timestamps: true })
export class RawTopic {
  @Prop({ required: true, unique: true, trim: true })
  readonly name!: string;
}

export const RawTopicSchema = SchemaFactory.createForClass(RawTopic);
