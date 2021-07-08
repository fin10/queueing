import moment from 'moment';
import { BadRequestException, Logger } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { NoteRemovedEvent } from '../note/events/note-removed.event';
import { NoteService } from '../note/note.service';
import { User } from '../user/schemas/user.schema';
import { EmotionType } from './interfaces/emotion-type.interface';
import { RawAction, RawActionDocument } from './schemas/raw-action.schema';
import { ReportType } from './interfaces/report-type.interface';
import { ActionName } from './interfaces/action-name.enum';
import { Locale } from '../localization/enums/locale.enum';
import LocalizationService from '../localization/localization.service';
import _ from 'underscore';

@Injectable()
export class ActionService {
  private readonly logger = new Logger(ActionService.name);

  constructor(
    @InjectModel(RawAction.name) private model: Model<RawActionDocument>,
    private readonly noteService: NoteService,
    private readonly localization: LocalizationService,
  ) {}

  async putEmotion(user: User, id: mongoose.Types.ObjectId, type: EmotionType) {
    const note = await this.noteService.getNote(id);
    if (!note) throw new NotFoundException(`Note not found with ${id}`);

    const action = await this.model.findOne({ userId: user._id, name: ActionName.EMOTION, note: note._id });
    if (action) {
      if (action.type !== type) {
        this.logger.debug(`Emotion type will be changed to ${type} from ${action.type} on ${id}`);
        await action.updateOne({ type });
      }
    } else {
      await this.model.create({ userId: user._id, name: ActionName.EMOTION, type, note: note._id });
    }

    return this.getEmotions(id);
  }

  async getEmotions(id: mongoose.Types.ObjectId) {
    const likes = await this.model.count({ note: id, name: ActionName.EMOTION, type: EmotionType.LIKE });
    const dislikes = await this.model.count({ note: id, name: ActionName.EMOTION, type: EmotionType.DISLIKE });

    return { likes, dislikes };
  }

  async getAction(id: mongoose.Types.ObjectId): Promise<RawAction> {
    return this.model.findById(id).lean();
  }

  async putReport(user: User, id: mongoose.Types.ObjectId, type: ReportType): Promise<void> {
    const note = await this.noteService.getNote(id);
    if (!note) throw new NotFoundException();

    const action = await this.model.findOne({ userId: user._id, name: ActionName.REPORT, note: note._id });
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
    const result = await this.model.deleteMany({ note: event.getId() });
    if (result.n) {
      this.logger.debug(`Removed actions (${result.n}) with ${event.getId()} in ${moment().diff(start, 'ms')}ms`);
    }
  }
}
