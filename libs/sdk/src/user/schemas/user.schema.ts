import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Restriction } from '../restriction';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  readonly provider!: string;

  @Prop({ required: true, unique: true })
  readonly key!: string;

  @Prop({ type: mongoose.SchemaTypes.Mixed })
  readonly restriction?: Restriction;

  readonly _id!: mongoose.Types.ObjectId;
  readonly createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
