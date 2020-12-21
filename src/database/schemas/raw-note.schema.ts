import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RawNoteDocument = RawNote & Document;

@Schema({ timestamps: true })
export class RawNote {
  @Prop({ required: true })
  readonly title!: string;

  @Prop({ required: true })
  readonly bodyKey!: string;

  readonly _id!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

export const RawNoteSchema = SchemaFactory.createForClass(RawNote);
