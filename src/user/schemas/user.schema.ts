import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RawUserDocument = RawUser & Document;

@Schema({ timestamps: true, autoIndex: true })
export class RawUser {
  @Prop({ required: true, unique: true })
  readonly id!: string;
}

export const RawUserSchema = SchemaFactory.createForClass(RawUser);
