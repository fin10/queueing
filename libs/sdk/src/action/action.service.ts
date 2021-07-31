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
import { CommentRemovedEvent } from '../comment/events/comment-removed.event';

@Injectable()
export class ActionService {
  private readonly logger = new Logger(ActionService.name);

  constructor(
    @InjectModel(Action.name) private model: Model<ActionDocument>,
    private readonly noteService: NoteService,
    private readonly localization: LocalizationService,
  ) {}

  async putEmotion(user: User, targetId: mongoose.Types.ObjectId, type: EmotionType) {
    const action = await this.model.findOne({ userId: user._id, name: ActionName.EMOTION, targetId });
    if (action) {
      if (action.type !== type) {
        this.logger.debug(`Emotion type will be changed to ${type} from ${action.type} on ${targetId}`);
        await action.updateOne({ type });
      }
    } else {
      await this.model.create({ userId: user._id, name: ActionName.EMOTION, type, targetId });
    }

    return this.getEmotionCounts(targetId);
  }

  async getEmotionCounts(targetId: mongoose.Types.ObjectId) {
    const likes: number = await this.model.countDocuments({
      targetId,
      name: ActionName.EMOTION,
      type: EmotionType.LIKE,
    });
    const dislikes: number = await this.model.countDocuments({
      targetId,
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

    const action = await this.model.findOne({ userId: user._id, name: ActionName.REPORT, targetId: note._id });
    if (action) throw new BadRequestException('Already reported');

    await this.model.create({ userId: user._id, name: ActionName.REPORT, type, targetId: note._id });
  }

  getReportTypes(locale: Locale): { code: ReportType; text: string }[] {
    return _.values(ReportType).map((type) => ({
      code: type,
      text: this.localization.enum(locale).reportType(type),
    }));
  }

  @OnEvent(NoteRemovedEvent.name, { nextTick: true })
  async onNoteRemoved(event: NoteRemovedEvent) {
    const start = moment();
    const result = await this.model.deleteMany({ targetId: event.getId() });
    if (result.n) {
      this.logger.debug(`Removed actions (${result.n}) with ${event.getId()} in ${moment().diff(start, 'ms')}ms`);
    }
  }

  @OnEvent(CommentRemovedEvent.name, { nextTick: true })
  async onCommentRemoved(event: CommentRemovedEvent) {
    const start = moment();
    const result = await this.model.deleteMany({ targetId: event.id });
    if (result.n) {
      this.logger.debug(`Removed actions (${result.n}) with ${event.id} in ${moment().diff(start, 'ms')}ms`);
    }
  }
}
