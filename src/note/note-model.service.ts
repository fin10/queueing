import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { RawNoteDocument } from './schemas/raw-note.schema';
import { RawNote } from './schemas/raw-note.schema';

@Injectable()
export class NoteModel {
  constructor(@InjectModel(RawNote.name) private model: Model<RawNoteDocument>) {}

  async create(topic: string, title: string | null, parentId?: string): Promise<string> {
    const note = new this.model({
      topic,
      title,
      parent: parentId,
    });
    await note.save();

    return note._id;
  }

  async getNote(id: string): Promise<RawNote | null> {
    return this.model.findById(id).lean();
  }

  async getNotes<T>(filter: FilterQuery<T>): Promise<RawNote[]> {
    return this.model.find(filter).lean();
  }

  async remove(id: string): Promise<void> {
    return this.model.deleteOne({ _id: id }).exec();
  }
}
