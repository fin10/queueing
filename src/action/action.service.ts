import { Logger } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { Model } from 'mongoose';
import { NoteRemovedEvent } from 'src/note/events/note-removed.event';
import { NoteService } from 'src/note/note.service';
import { EmotionType } from './interfaces/emotion-type.interface';
import { RawAction, RawActionDocument } from './schemas/raw-action.schema';

enum ActionName {
  EMOTION = 'emotion',
}

@Injectable()
export class ActionService {
  private readonly logger = new Logger(ActionService.name);

  constructor(
    @InjectModel(RawAction.name) private model: Model<RawActionDocument>,
    private readonly noteService: NoteService,
  ) {}

  async putEmotion(id: string, type: EmotionType): Promise<void> {
    const note = await this.noteService.getNote(id);
    if (!note) throw new NotFoundException(`Note not found with ${id}`);

    await this.model.deleteOne({ name: ActionName.EMOTION, note: note._id });
    await this.model.create({ name: ActionName.EMOTION, type, note: note._id });
  }

  async getEmotions(id: string, type: EmotionType): Promise<number> {
    return this.model.find({ note: id, name: ActionName.EMOTION, type }).countDocuments();
  }

  @OnEvent(NoteRemovedEvent.name, { nextTick: true })
  async onNoteRemoved(event: NoteRemovedEvent): Promise<void> {
    const start = moment();
    const result = await this.model.deleteMany({ note: event.getId() });
    if (result.n) {
      this.logger.debug(`Removed actions (${result.n}) with ${event.getId()} in ${moment().diff(start, 'ms')}ms`);
    }
  }
}
