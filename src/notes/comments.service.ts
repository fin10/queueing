import _ from 'underscore';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NoteBodyService } from './note-body.service';
import { NoteModel } from '../database/note-model.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Note } from './dto/note.dto';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(private readonly noteModel: NoteModel, private readonly bodyStore: NoteBodyService) {}

  async create(data: CreateCommentDto): Promise<string> {
    const { parentId, body } = data;

    const parentNote = await this.noteModel.getNote(parentId);
    if (!parentNote) throw new NotFoundException(`parent not found: ${parentId}`);

    const id = await this.noteModel.create(parentNote.topic, null, parentId);
    await this.bodyStore.put(id, body);

    return id;
  }

  async getComments(id: string): Promise<Note[]> {
    const rawNotes = await this.noteModel.getNotes({ parent: id });

    return _.compact(
      await Promise.all(
        rawNotes.map(async (rawNote) => {
          const body = await this.bodyStore.get(rawNote._id);
          if (!body) {
            this.logger.verbose(`${rawNote._id} has been expired.`);
            this.noteModel.remove(rawNote._id);
            return null;
          }

          return Note.instantiate(rawNote, body);
        }),
      ),
    );
  }
}
