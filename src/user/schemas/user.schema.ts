import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, autoIndex: true })
export class User {
  @Prop({ required: true, unique: true })
  readonly id!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
