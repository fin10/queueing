import moment from 'moment';
import { BadRequestException, Logger } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { NoteRemovedEvent } from '../note/events/note-removed.event';
import { NoteService } from '../note/note.service';
import { User } from '../user/schemas/user.schema';
import { EmotionType } from './enums/emotion-type.enum';
import { Action, ActionDocument } from './schemas/action.schema';
import { ReportType } from './enums/report-type.enum';
import { ActionName } from './enums/action-name.enum';
import { Locale } from '../localization/enums/locale.enum';
import LocalizationService from '../localization/localization.service';
import _ from 'underscore';

@Injectable()
export class ActionService {
  private readonly logger = new Logger(ActionService.name);

  constructor(
    @InjectModel(Action.name) private model: Model<ActionDocument>,
    private readonly noteService: NoteService,
    private readonly localization: LocalizationService,
  ) {}

  async putEmotion(user: User, noteId: mongoose.Types.ObjectId, type: EmotionType) {
    const note = await this.noteService.getNote(noteId);
    if (!note) throw new NotFoundException(`Note not found with ${noteId}`);

    const action = await this.model.findOne({ userId: user._id, name: ActionName.EMOTION, noteId: note._id });
    if (action) {
      if (action.type !== type) {
        this.logger.debug(`Emotion type will be changed to ${type} from ${action.type} on note(${noteId})`);
        await action.updateOne({ type });
      }
    } else {
      await this.model.create({ userId: user._id, name: ActionName.EMOTION, type, noteId: note._id });
    }

    return this.getEmotionCounts(noteId);
  }

  async getEmotionCounts(noteId: mongoose.Types.ObjectId) {
    const likes: number = await this.model.countDocuments({ noteId, name: ActionName.EMOTION, type: EmotionType.LIKE });
    const dislikes: number = await this.model.countDocuments({
      noteId,
      name: ActionName.EMOTION,
      type: EmotionType.DISLIKE,
    });

    return { likes, dislikes };
  }

  async getAction(id: mongoose.Types.ObjectId): Promise<ActionDocument> {
    return this.model.findById(id).lean();
  }

  async putReport(user: User, id: mongoose.Types.ObjectId, type: ReportType): Promise<void> {
    const note = await this.noteService.getNote(id);
    if (!note) throw new NotFoundException();

    const action = await this.model.findOne({ userId: user._id, name: ActionName.REPORT, noteId: note._id });
    if (action) throw new BadRequestException('Already reported');

    await this.model.create({ userId: user._id, name: ActionName.REPORT, type, note: note._id });
  }

  getReportTypes(locale: Locale): { code: ReportType; text: string }[] {
    return _.values(ReportType).map((type) => ({
      code: type,
      text: this.localization.enum(locale).reportType(type),
    }));
  }

  @OnEvent(NoteRemovedEvent.name, { nextTick: true })
  async onNoteRemoved(event: NoteRemovedEvent): Promise<void> {
    const start = moment();
    const result = await this.model.deleteMany({ noteId: event.getId() });
    if (result.n) {
      this.logger.debug(`Removed actions (${result.n}) with ${event.getId()} in ${moment().diff(start, 'ms')}ms`);
    }
  }
}
