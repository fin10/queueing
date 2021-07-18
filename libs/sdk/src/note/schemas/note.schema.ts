import { User } from '@lib/sdk/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type NoteDocument = Note & Document;

@Schema({ timestamps: true })
export class Note {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly userId!: mongoose.Types.ObjectId;

  @Prop()
  readonly topic?: string;

  @Prop()
  readonly title?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Note.name })
  readonly parent?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  readonly expireTime!: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
