import _ from 'underscore';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NoteBodyService } from 'src/note/note-body.service';
import { NoteService } from 'src/note/note.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Note } from 'src/note/dto/note.dto';
import { NoteRemovedEvent } from 'src/note/events/note-removed.event';
import { OnEvent } from '@nestjs/event-emitter';
import moment from 'moment';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(private readonly noteService: NoteService, private readonly bodyStore: NoteBodyService) {}

  async create(data: CreateCommentDto): Promise<string> {
    const { parentId, body } = data;

    const parentNote = await this.noteService.getNote(parentId);
    if (!parentNote) throw new NotFoundException(`parent not found: ${parentId}`);

    const id = await this.noteService.createWithParentId(parentId);
    await this.bodyStore.put(id, body);

    return id;
  }

  async getValidComments(parentId: string): Promise<Note[]> {
    const rawNotes = await this.noteService.getNotes({ parent: parentId });

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

  @OnEvent(NoteRemovedEvent.name, { nextTick: true })
  async onNoteRemoved(event: NoteRemovedEvent): Promise<void> {
    this.logger.debug(`Received note removed event: ${event.getId()}`);

    const start = moment();
    const count = await this.noteService.removeChildren(event.getId());
    this.logger.debug(`Removed comments (${count}) with ${event.getId()} in ${moment().diff(start, 'ms')}ms`);
  }
}
