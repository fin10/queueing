import _ from 'underscore';
import moment from 'moment';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ActionService } from '../action/action.service';
import { User } from '../user/schemas/user.schema';
import { ProfileService } from '../profile/profile.service';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ActionName } from '../action/enums/action-name.enum';
import { EmotionType } from '../action/enums/emotion-type.enum';
import { CommentDetail } from './interfaces/comment-detail.interface';
import { ArticleRemovedEvent } from '../article/events/article-removed.event';
import { ContentsService } from '../contents/contents.service';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @InjectModel(Comment.name) private readonly model: Model<CommentDocument>,
    private readonly actionService: ActionService,
    private readonly contentsService: ContentsService,
    private readonly profileService: ProfileService,
  ) {}

  async create(user: User, data: CreateCommentDto) {
    const { articleId, contents } = data;

    const comment = new this.model({ userId: user._id, parent: articleId });
    await comment.save();

    try {
      await this.contentsService.put(comment._id, contents);
    } catch (err) {
      await comment.remove();
      throw err;
    }

    return this.populateComment(comment);
  }

  async remove(id: mongoose.Types.ObjectId) {
    const comment = await this.model.findById(id);
    if (!comment) throw new NotFoundException(`Comment not found with ${id}`);

    await comment.remove();
  }

  async getUserId(id: mongoose.Types.ObjectId) {
    const comment = await this.model.findById(id);
    if (!comment) throw new NotFoundException(`Comment not found with ${id}`);

    return comment.userId;
  }

  exists(id: mongoose.Types.ObjectId) {
    return this.model.exists({ _id: id });
  }

  async getComment(id: mongoose.Types.ObjectId) {
    const comment = await this.model.findById(id);
    if (!comment) throw new NotFoundException(`Comment not found with ${id}`);

    return this.populateComment(comment);
  }

  async getComments(articleId: mongoose.Types.ObjectId) {
    const comments = await this.model.find({ parent: articleId });
    if (!comments.length) return [];

    return _.compact(await Promise.all(comments.map((comment) => this.populateComment(comment))));
  }

  count(filter?: FilterQuery<CommentDocument>): Promise<number> {
    return this.model.countDocuments(filter);
  }

  @OnEvent(ArticleRemovedEvent.name, { nextTick: true })
  async onArticleRemoved(event: ArticleRemovedEvent) {
    const start = moment();

    const comments = await this.model.find({ parent: event.id }, '_id');
    if (comments.length) {
      await Promise.all(comments.map((comment) => comment.remove()));
      this.logger.debug(`Removed comments (${comments.length}) with ${event.id} in ${moment().diff(start, 'ms')}ms`);
    }
  }

  private async populateComment(comment: CommentDocument): Promise<CommentDetail> {
    const contents = await this.contentsService.get(comment._id);
    if (!contents) {
      await comment.remove();
      this.logger.verbose(`Comment(${comment._id}) has been expired.`);
      return null;
    }

    const profile = await this.profileService.getProfile(comment.userId);
    const likes = await this.actionService.count({
      name: ActionName.EMOTION,
      type: EmotionType.LIKE,
      targetId: comment._id,
    });
    const dislikes = await this.actionService.count({
      name: ActionName.EMOTION,
      type: EmotionType.DISLIKE,
      targetId: comment._id,
    });

    return {
      id: comment._id,
      articleId: comment.parent,
      creator: profile.name,
      contents,
      created: comment.get('createdAt'),
      updated: comment.get('updatedAt'),
      likes,
      dislikes,
    };
  }
}
