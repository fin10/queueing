import { Injectable, NotFoundException } from '@nestjs/common';
import { NoteBodyService } from './note-body.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './interfaces/note.interface';
import { NoteModel } from '../database/note-model.service';

@Injectable()
export class NotesService {
  constructor(private readonly noteModel: NoteModel, private readonly bodyStore: NoteBodyService) {}

  async create(data: CreateNoteDto): Promise<string> {
    const { topic, title, body } = data;

    const id = await this.noteModel.create(topic, title);
    await this.bodyStore.put(id, body);

    return id;
  }

  async getNoteBody(id: string): Promise<string> {
    const body = await this.bodyStore.get(id);
    if (!body) throw new NotFoundException(`${id} has been expired.`);

    return body;
  }

  async getNote(id: string): Promise<Note> {
    const rawNote = await this.noteModel.getNote(id);
    if (!rawNote) throw new NotFoundException(`${id} not found.`);

    return {
      id: rawNote._id,
      title: rawNote.title,
      created: rawNote.createdAt,
      updated: rawNote.updatedAt,
      children: 0,
      like: 0,
      dislike: 0,
      user: 'tmp',
    };
  }

  async getNotes(): Promise<Note[]> {
    const rawNotes = await this.noteModel.getNotes();

    return rawNotes.map((rawNote) => ({
      id: rawNote._id,
      title: rawNote.title,
      created: rawNote.createdAt,
      updated: rawNote.updatedAt,
      children: 0,
      like: 0,
      dislike: 0,
      user: 'tmp',
    }));
  }
}
