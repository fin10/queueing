import moment from 'moment';
import { Logger } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { NoteRemovedEvent } from '../note/events/note-removed.event';
import { User } from '../user/schemas/user.schema';
import { EmotionType } from './enums/emotion-type.enum';
import { Action, ActionDocument } from './schemas/action.schema';
import { ActionName } from './enums/action-name.enum';
import { CommentRemovedEvent } from '../comment/events/comment-removed.event';
import { MongoErrorCode } from '../exceptions/mongo-error.code';

@Injectable()
export class ActionService {
  private readonly logger = new Logger(ActionService.name);

  constructor(@InjectModel(Action.name) private model: Model<ActionDocument>) {}

  async putAction(user: User, name: ActionName, type: string, targetId: mongoose.Types.ObjectId) {
    try {
      await this.model.create({ userId: user._id, name, type, targetId });
    } catch (err) {
      if (err.code === MongoErrorCode.DUPLICATE_KEY) {
        this.logger.warn(`Action already exists for User(${user._id}), Action(${name}) and target(${targetId})`);
      } else {
        this.logger.error(`Failed to put action for User(${user._id}), Action(${name})`, err.stack);
        throw err;
      }
    }
  }

  async putEmotion(user: User, targetId: mongoose.Types.ObjectId, type: EmotionType) {
    const action = await this.model.findOne({ userId: user._id, name: ActionName.EMOTION, targetId });
    if (action) {
      if (action.type !== type) {
        this.logger.debug(`Emotion type will be changed to ${type} from ${action.type} on ${targetId}`);
        await action.updateOne({ type });
      }
    } else {
      await this.putAction(user, ActionName.EMOTION, type, targetId);
    }

    const likes = await this.count({
      name: ActionName.EMOTION,
      type: EmotionType.LIKE,
      targetId,
    });

    const dislikes = await this.count({
      name: ActionName.EMOTION,
      type: EmotionType.DISLIKE,
      targetId,
    });

    return { likes, dislikes };
  }

  count(filter: FilterQuery<ActionDocument>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  getAction(id: mongoose.Types.ObjectId): Promise<ActionDocument> {
    return this.model.findById(id).lean();
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
