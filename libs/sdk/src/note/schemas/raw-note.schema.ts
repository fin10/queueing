import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RawNoteDocument = RawNote & Document;

@Schema({ timestamps: true })
export class RawNote {
  @Prop({ required: true })
  readonly userId!: string;

  @Prop()
  readonly topic?: string;

  @Prop()
  readonly title?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: RawNote.name })
  readonly parent?: string;

  @Prop({ required: true })
  readonly expireTime!: Date;

  readonly _id!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

export const RawNoteSchema = SchemaFactory.createForClass(RawNote);