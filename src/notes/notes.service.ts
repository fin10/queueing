import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NoteBodyService } from './note-body.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './dto/note.dto';
import { NoteModel } from '../database/note-model.service';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(private readonly noteModel: NoteModel, private readonly bodyStore: NoteBodyService) {}

  async create(data: CreateNoteDto): Promise<string> {
    const { topic, title, body } = data;

    const id = await this.noteModel.create(topic, title);
    await this.bodyStore.put(id, body);

    return id;
  }

  async getNote(id: string): Promise<Note> {
    const rawNote = await this.noteModel.getNote(id);
    if (!rawNote) throw new NotFoundException(`${id} not found.`);

    const body = await this.bodyStore.get(rawNote._id);
    if (!body) {
      this.noteModel.remove(rawNote._id);
      throw new NotFoundException(`${id} has been expired.`);
    }

    return Note.instantiate(rawNote, body);
  }

  async getNotes(): Promise<Note[]> {
    const rawNotes = await this.noteModel.getNotes({ parent: { $exists: false } });
    return rawNotes.map((rawNote) => Note.instantiate(rawNote));
  }
}
