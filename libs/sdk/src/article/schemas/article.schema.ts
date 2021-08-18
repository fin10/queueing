import { User } from '@lib/sdk/user/schemas/user.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: User.name })
  readonly userId!: mongoose.Types.ObjectId;

  @Prop({ required: true, type: String })
  readonly topic: string;

  @Prop({ required: true, type: String, trim: true })
  readonly title: string;

  @Prop({ required: true })
  readonly expireTime!: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
