import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { NoteBodyService } from '../note/note-body.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { Note } from '../note/dto/note.dto';
import { NoteService } from '../note/note.service';
import { TopicService } from '../topic/topic.service';
import { RawNote } from '../note/schemas/raw-note.schema';
import { ActionService } from '../action/action.service';
import { User } from '../user/schemas/user.schema';
import { ArticlesResponse } from './interfaces/articles-response.interface';
import { NoteBodyEntity } from '../note/note-body.entity';
import { ProfileService } from '../profile/profile.service';
import mongoose from 'mongoose';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    private readonly topicService: TopicService,
    private readonly noteService: NoteService,
    private readonly actionService: ActionService,
    private readonly bodyService: NoteBodyService,
    private readonly profileService: ProfileService,
  ) {}

  async create(user: User, data: CreateArticleDto) {
    const { topic, title, body } = data;

    const rawTopic = await this.topicService.getOrCreate(user, topic);
    const id = await this.noteService.create(user, rawTopic.name, title);
    await this.bodyService.put(id, body);

    return this.getArticle(id);
  }

  async update(user: User, id: mongoose.Types.ObjectId, data: CreateArticleDto) {
    const { topic, title, body } = data;

    const rawTopic = await this.topicService.getOrCreate(user, topic);
    await this.noteService.update(id, rawTopic.name, title);
    await this.bodyService.remove(id);
    await this.bodyService.put(id, body);

    return this.getArticle(id);
  }

  async remove(id: mongoose.Types.ObjectId): Promise<void> {
    const note = await this.noteService.getNote(id);
    if (!note) throw new NotFoundException();

    return this.noteService.remove(id);
  }

  async getArticle(id: mongoose.Types.ObjectId): Promise<Note> {
    const rawNote = await this.noteService.getNote(id);
    if (!rawNote) throw new NotFoundException(`${id} not found.`);

    const body = await this.bodyService.get(rawNote._id);
    if (!body) {
      this.noteService.remove(rawNote._id);
      throw new NotFoundException(`${id} has been expired.`);
    }

    return this.populate(rawNote, body);
  }

  async getArticles(page: number, limit: number): Promise<ArticlesResponse> {
    const result = await this.noteService.paginateNotes({ parent: { $exists: false } }, page, limit, '-createdAt');
    const populated = await Promise.all(result.docs.map((rawNote) => this.populate(rawNote)));

    return {
      page: result.page || -1,
      pageSize: result.limit,
      totalPages: result.totalPages,
      notes: populated,
    };
  }

  private async populate(rawNote: RawNote, body?: NoteBodyEntity[]): Promise<Note> {
    const profile = this.profileService.getProfile(rawNote.userId);
    const comments = await this.noteService.count({ parent: rawNote._id });
    const { likes, dislikes } = await this.actionService.getEmotionCounts(rawNote._id);

    return Note.instantiate(profile, { ...rawNote }, comments, likes, dislikes, body);
  }
}
