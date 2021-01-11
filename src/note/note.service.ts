import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { RawNote, RawNoteDocument } from './schemas/raw-note.schema';

@Injectable()
export class NoteService {
  constructor(@InjectModel(RawNote.name) private model: Model<RawNoteDocument>) {}

  async createWithParentId(parentId: string): Promise<string> {
    const note = new this.model({
      parent: parentId,
    });
    await note.save();

    return note._id;
  }

  async create(topic: string, title: string): Promise<string> {
    const note = new this.model({
      topic,
      title,
    });
    await note.save();

    return note._id;
  }

  async getNote(id: string): Promise<RawNote | null> {
    return this.model.findById(id).lean();
  }

  async getNotes<T>(filter: FilterQuery<T>, sorting?: string): Promise<RawNote[]> {
    return this.model.find(filter).sort(sorting).lean();
  }

  async remove(id: string): Promise<void> {
    return this.model.deleteOne({ _id: id }).exec();
  }

  async count<T>(filter: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(filter).lean();
  }
}
