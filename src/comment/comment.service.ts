import _ from 'underscore';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NoteBodyService } from 'src/note/note-body.service';
import { NoteService } from 'src/note/note.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Note } from 'src/note/dto/note.dto';
import { NoteRemovedEvent } from 'src/note/events/note-removed.event';
import { OnEvent } from '@nestjs/event-emitter';
import moment from 'moment';
import { ActionService } from 'src/action/action.service';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    private readonly noteService: NoteService,
    private readonly actionService: ActionService,
    private readonly bodyStore: NoteBodyService,
  ) {}

  async create(data: CreateCommentDto): Promise<string> {
    const { parentId, body } = data;

    const parentNote = await this.noteService.getNote(parentId);
    if (!parentNote) throw new NotFoundException(`comments not found from ${parentId}`);

    const id = await this.noteService.createWithParentId(parentId);
    await this.bodyStore.put(id, body);

    return id;
  }

  async remove(id: string): Promise<void> {
    return this.noteService.remove(id);
  }

  async getComment(id: string): Promise<Note> {
    const rawNote = await this.noteService.getNote(id);
    if (!rawNote) throw new NotFoundException(`${id} not found.`);

    const body = await this.bodyStore.get(rawNote._id);
    if (!body) {
      this.noteService.remove(rawNote._id);
      throw new NotFoundException(`${rawNote._id} has been expired.`);
    }

    const like = await this.actionService.getLikes(rawNote._id);

    return Note.instantiate(rawNote, 0, like, body);
  }

  async getComments(parentId: string): Promise<Note[]> {
    const rawNotes = await this.noteService.getNotes({ parent: parentId });

    return _.compact(
      await Promise.all(
        rawNotes.map(async (rawNote) => {
          const body = await this.bodyStore.get(rawNote._id);
          if (!body) {
            this.noteService.remove(rawNote._id);
            this.logger.verbose(`${rawNote._id} has been expired.`);
            return null;
          }

          const like = await this.actionService.getLikes(rawNote._id);

          return Note.instantiate(rawNote, 0, like, body);
        }),
      ),
    );
  }

  @OnEvent(NoteRemovedEvent.name, { nextTick: true })
  async onNoteRemoved(event: NoteRemovedEvent): Promise<void> {
    const start = moment();
    const count = await this.noteService.removeChildren(event.getId());
    if (count) {
      this.logger.debug(`Removed comments (${count}) with ${event.getId()} in ${moment().diff(start, 'ms')}ms`);
    }
  }
}
