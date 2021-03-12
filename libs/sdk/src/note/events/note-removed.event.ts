import mongoose from 'mongoose';

export class NoteRemovedEvent {
  constructor(private readonly id: mongoose.Types.ObjectId) {}

  getId(): mongoose.Types.ObjectId {
    return this.id;
  }
}
