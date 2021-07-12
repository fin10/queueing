import mongoose from 'mongoose';

export interface ArticleSummary {
  readonly id: mongoose.Types.ObjectId;
  readonly creator: string;
  readonly topic: string;
  readonly title: string;
  readonly created: Date;
  readonly updated: Date;
  readonly expireTime: Date;
  readonly children: number;
  readonly likes: number;
  readonly dislikes: number;
}
