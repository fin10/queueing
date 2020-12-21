import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawNoteDocument } from './schemas/raw-note.schema';
import { RawNote } from './schemas/raw-note.schema';

@Injectable()
export class NoteModel {
  constructor(@InjectModel(RawNote.name) private model: Model<RawNoteDocument>) {}

  async create(title: string, bodyKey: string): Promise<string> {
    const note = new this.model({
      title,
      bodyKey,
    });
    await note.save();

    return note._id;
  }

  async getNote(id: string): Promise<RawNote> {
    const rawNote = await this.model.findById(id).lean();
    if (!rawNote) throw new NotFoundException(`${id} not found.`);
    return rawNote;
  }

  async getNotes(): Promise<RawNote[]> {
    return this.model.find().lean();
  }

  async remove(id: string): Promise<void> {
    return this.model.deleteOne({ _id: id }).exec();
  }
}
