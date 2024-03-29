import { User } from '@lib/sdk/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ActionDocument = Action & Document;

@Schema({ timestamps: true })
export class Action {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  readonly name: string;

  @Prop({ required: true })
  readonly type: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  readonly targetId: mongoose.Types.ObjectId;
}

export const ActionSchema = SchemaFactory.createForClass(Action);
