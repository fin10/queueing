import { User } from '@lib/sdk/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { RawNote } from '../../note/schemas/raw-note.schema';

export type RawActionDocument = RawAction & Document;

@Schema({ timestamps: true })
export class RawAction {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly userId!: mongoose.Types.ObjectId;

  @Prop({ required: true })
  readonly name!: string;

  @Prop({ required: true })
  readonly type!: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: RawNote.name })
  readonly note!: mongoose.Types.ObjectId;

  readonly _id!: mongoose.Types.ObjectId;
}

export const RawActionSchema = SchemaFactory.createForClass(RawAction);
