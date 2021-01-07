import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TopicDocument = Topic & Document;

@Schema({ timestamps: true })
export class Topic {
  @Prop({ required: true, unique: true })
  readonly name!: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
