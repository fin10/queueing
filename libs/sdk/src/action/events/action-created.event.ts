import mongoose from 'mongoose';

export class ActionCreatedEvent {
  constructor(readonly id: mongoose.Types.ObjectId, readonly name: string) {}
}
