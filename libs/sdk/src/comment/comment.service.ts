import _ from 'underscore';
import moment from 'moment';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NoteBodyService } from '../note/note-body.service';
import { NoteService } from '../note/note.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NoteRemovedEvent } from '../note/events/note-removed.event';
import { ActionService } from '../action/action.service';
import { User } from '../user/schemas/user.schema';
import { ProfileService } from '../profile/profile.service';
import mongoose, { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);

  constructor(
    @InjectModel(Comment.name) private readonly model: Model<CommentDocument>,
    private readonly noteService: NoteService,
    private readonly actionService: ActionService,
    private readonly bodyService: NoteBodyService,
    private readonly profileService: ProfileService,
  ) {}

  async create(user: User, data: CreateCommentDto) {
    const { articleId, body } = data;

    const parentNote = await this.noteService.getNote(articleId);
    if (!parentNote) throw new NotFoundException(`Note not found with ${articleId}`);

    const comment = new this.model({
      userId: user._id,
      parent: parentNote._id,
    });
    await comment.save();

    try {
      await this.bodyService.put(comment._id, body);
    } catch (err) {
      await comment.remove();
      throw err;
    }

    return this.getComment(comment);
  }

  async remove(id: mongoose.Types.ObjectId) {
    if (!(await this.model.exists({ _id: id }))) {
      throw new NotFoundException(`Comment not found with ${id}`);
    }

    await this.model.remove({ _id: id });
    await this.bodyService.remove(id);
  }

  async getComments(articleId: mongoose.Types.ObjectId) {
    const comments = await this.model.find({ parent: articleId });
    if (!comments.length) return [];

    return _.compact(await Promise.all(comments.map((comment) => this.getComment(comment))));
  }

  @OnEvent(NoteRemovedEvent.name, { nextTick: true })
  async onNoteRemoved(event: NoteRemovedEvent) {
    const start = moment();

    const ids = await this.model.find({ parent: event.getId() }, '_id');
    ids.forEach(({ _id }) => this.bodyService.remove(_id));

    const count = await this.model.deleteMany({ parent: event.getId() });
    if (count) {
      this.logger.debug(`Removed comments (${count}) with ${event.getId()} in ${moment().diff(start, 'ms')}ms`);
    }
  }

  private async getComment(comment: CommentDocument) {
    const body = await this.bodyService.get(comment._id);
    if (!body) {
      await this.model.findByIdAndDelete(comment._id);
      this.logger.verbose(`Comment(${comment._id}) has been expired.`);
      return null;
    }

    const profile = this.profileService.getProfile(comment.userId);
    const { likes, dislikes } = await this.actionService.getEmotionCounts(comment._id);

    return {
      id: comment._id,
      articleId: comment.parent,
      creator: profile.name,
      body,
      created: comment.get('createdAt'),
      updated: comment.get('updatedAt'),
      likes,
      dislikes,
    };
  }
}
