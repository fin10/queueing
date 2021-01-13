import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { Document } from 'mongoose';

export type RawNoteDocument = RawNote & Document;

@Schema({ timestamps: true })
export class RawNote {
  @Prop()
  readonly topic?: string;

  @Prop()
  readonly title?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: RawNote.name })
  readonly parent?: string;

  readonly _id!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  readonly children?: number;

  static getExpireTime(note: RawNote): Date | null {
    const index = RawNoteSchema.indexes().find(([fields]) => fields.createdAt);
    const [, opts] = index || [];
    const { expireAfterSeconds } = opts || {};
    if (!expireAfterSeconds) return null;

    return moment.utc(note.createdAt).add(expireAfterSeconds, 's').toDate();
  }
}

export const RawNoteSchema = SchemaFactory.createForClass(RawNote);
