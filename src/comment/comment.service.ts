import _ from 'underscore';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NoteBodyService } from 'src/note/note-body.service';
import { NoteService } from 'src/note/note.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Note } from 'src/note/dto/note.dto';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(private readonly noteService: NoteService, private readonly bodyStore: NoteBodyService) {}

  async create(data: CreateCommentDto): Promise<string> {
    const { parentId, body } = data;

    const parentNote = await this.noteService.getNote(parentId);
    if (!parentNote) throw new NotFoundException(`parent not found: ${parentId}`);

    const id = await this.noteService.create(parentNote.topic, null, parentId);
    await this.bodyStore.put(id, body);

    return id;
  }

  async getComments(id: string): Promise<Note[]> {
    const rawNotes = await this.noteService.getNotes({ parent: id });

    return _.compact(
      await Promise.all(
        rawNotes.map(async (rawNote) => {
          const body = await this.bodyStore.get(rawNote._id);
          if (!body) {
            this.logger.verbose(`${rawNote._id} has been expired.`);
            this.noteService.remove(rawNote._id);
            return null;
          }

          return Note.instantiate(rawNote, body);
        }),
      ),
    );
  }
}
