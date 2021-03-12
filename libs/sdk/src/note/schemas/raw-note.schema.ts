import { User } from '@lib/sdk/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type RawNoteDocument = RawNote & Document;

@Schema({ timestamps: true })
export class RawNote {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly userId!: mongoose.Types.ObjectId;

  @Prop()
  readonly topic?: string;

  @Prop()
  readonly title?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: RawNote.name })
  readonly parent?: mongoose.Types.ObjectId;

  @Prop({ required: true })
  readonly expireTime!: Date;

  readonly _id!: mongoose.Types.ObjectId;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

export const RawNoteSchema = SchemaFactory.createForClass(RawNote);
