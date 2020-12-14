import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note, NoteDocument } from './schemas/note.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private model: Model<NoteDocument>) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = new this.model(createNoteDto);
    return note.save();
  }

  async getNotes(): Promise<Note[]> {
    return this.model.find();
  }
}
