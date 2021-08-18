import { NoteBodyEntity } from '@lib/sdk/note/note-body.entity';
import mongoose from 'mongoose';

export interface CommentDetail {
  readonly id: mongoose.Types.ObjectId;
  readonly creator: string;
  readonly articleId: mongoose.Types.ObjectId;
  readonly body: NoteBodyEntity[];
  readonly created: Date;
  readonly updated: Date;
  readonly likes: number;
  readonly dislikes: number;
}
