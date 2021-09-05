import mongoose from 'mongoose';

export class ReportingCreatedEvent {
  constructor(readonly id: mongoose.Types.ObjectId) {}
}
