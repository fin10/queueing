import mongoose from 'mongoose';

export class CommentRemovedEvent {
  constructor(readonly id: mongoose.Types.ObjectId) {}
}
