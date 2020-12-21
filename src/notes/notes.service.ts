import _ from 'underscore';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NoteBodyService } from './note-body.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './interfaces/note.interface';
import { NoteModel } from '../database/note-model.service';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(private readonly noteModel: NoteModel, private readonly bodyStore: NoteBodyService) {}

  async create(data: CreateNoteDto): Promise<string> {
    const title = this.extractTitle(data.body);
    const bodyKey = this.bodyStore.put(data.body);
    return this.noteModel.create(title, bodyKey);
  }

  async getNote(id: string): Promise<Note | null> {
    const rawNote = await this.noteModel.getNote(id);

    const body = this.bodyStore.get(rawNote.bodyKey);
    if (!body) {
      this.noteModel.remove(id);
      throw new NotFoundException(`${id} has been expired.`);
    }

    return {
      id: rawNote._id,
      title: rawNote.title,
      body,
      created: rawNote.createdAt,
      updated: rawNote.updatedAt,
    };
  }

  async getNotes(): Promise<Note[]> {
    const rawNotes = await this.noteModel.getNotes();

    return rawNotes
      .filter((rawNote) => {
        const body = this.bodyStore.get(rawNote.bodyKey);
        if (body) return true;

        this.logger.verbose(`${rawNote._id}: body has been evicted.`);
        this.noteModel.remove(rawNote._id);
        return false;
      })
      .map((rawNote) => ({
        id: rawNote._id,
        title: rawNote.title,
        created: rawNote.createdAt,
        updated: rawNote.updatedAt,
      }));
  }

  private extractTitle(body: string): string {
    const title = _.chain(body.split('\n'))
      .map((line) => line.trim())
      .first()
      .value();

    return title || body;
  }
}
