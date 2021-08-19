import { ContentsEntity } from '@lib/sdk/contents/contents.entity';
import mongoose from 'mongoose';

export interface ArticleDetail {
  readonly id: mongoose.Types.ObjectId;
  readonly creator: string;
  readonly topic: string;
  readonly title: string;
  readonly body: ContentsEntity[];
  readonly created: Date;
  readonly updated: Date;
  readonly expireTime: Date;
  readonly children: number;
  readonly likes: number;
  readonly dislikes: number;
}
