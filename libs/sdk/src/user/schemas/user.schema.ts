import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  readonly provider!: string;

  @Prop({ required: true, unique: true })
  readonly key!: string;

  @Prop({ default: [Role.User] })
  readonly roles!: Role[];

  readonly _id!: mongoose.Types.ObjectId;
  readonly createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
