import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  readonly provider!: string;

  @Prop({ required: true, unique: true })
  readonly key!: string;

  readonly _id!: ObjectId;
  readonly createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
