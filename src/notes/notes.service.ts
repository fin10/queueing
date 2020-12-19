import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteBodyService } from './note-body.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './interfaces/note.interface';
import { RawNote, RawNoteDocument } from './schemas/raw-note.schema';

@Injectable()
export class NotesService {
  constructor(
    @InjectModel(RawNote.name)
    private model: Model<RawNoteDocument>,
    private readonly bodyStore: NoteBodyService,
  ) {}

  async create(data: CreateNoteDto): Promise<RawNote> {
    const title = this.extractTitle(data.body);
    const bodyKey = this.bodyStore.put(data.body);

    const note = new this.model({
      title,
      bodyKey,
    });

    return note.save();
  }

  async getNote(id: string): Promise<Note | null> {
    const rawNote = await this.model.findById(id).lean();
    if (!rawNote) throw new NotFoundException(`${id} not found.`);

    const body = this.bodyStore.get(rawNote.bodyKey);
    if (!body) throw new NotFoundException(`${id} has been expired.`);

    return {
      id: rawNote._id,
      title: rawNote.title,
      body,
      created: rawNote.createdAt,
      updated: rawNote.updatedAt,
    };
  }

  async getNotes(): Promise<Note[]> {
    const rawNotes = await this.model.find().lean();

    return rawNotes.map((rawNote) => ({
      id: rawNote._id,
      title: rawNote.title,
      created: rawNote.createdAt,
      updated: rawNote.updatedAt,
    }));
  }

  private extractTitle(body: string): string {
    const [title] = body.split('\n');
    return title;
  }
}
