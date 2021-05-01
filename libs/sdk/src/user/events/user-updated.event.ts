import mongoose from 'mongoose';

export class UserUpdatedEvent {
  constructor(readonly id: mongoose.Types.ObjectId) {}
}
