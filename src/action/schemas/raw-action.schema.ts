import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { RawNote } from 'src/note/schemas/raw-note.schema';

export type RawActionDocument = RawAction & Document;

@Schema({ timestamps: true })
export class RawAction {
  @Prop({ required: true })
  readonly name!: string;

  @Prop({ required: true })
  readonly type!: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: RawNote.name })
  readonly note!: string;
}

export const RawActionSchema = SchemaFactory.createForClass(RawAction);
