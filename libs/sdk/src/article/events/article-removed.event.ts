import mongoose from 'mongoose';

export class ArticleRemovedEvent {
  constructor(readonly id: mongoose.Types.ObjectId) {}
}
