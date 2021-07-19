import { Injectable, NotFoundException } from '@nestjs/common';
import mongoose from 'mongoose';
import { NoteBodyService } from '../note/note-body.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { NoteService } from '../note/note.service';
import { TopicService } from '../topic/topic.service';
import { ActionService } from '../action/action.service';
import { User } from '../user/schemas/user.schema';
import { ProfileService } from '../profile/profile.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleDetail } from './interfaces/article-detail.interface';
import { ArticleSummary } from './interfaces/article-summary.interface';

@Injectable()
export class ArticleService {
  constructor(
    private readonly topicService: TopicService,
    private readonly noteService: NoteService,
    private readonly actionService: ActionService,
    private readonly bodyService: NoteBodyService,
    private readonly profileService: ProfileService,
  ) {}

  async create(user: User, { topic: topicName, title, body }: CreateArticleDto) {
    const topic = await this.topicService.getOrCreate(user, topicName);
    const id = await this.noteService.create(user, topic.name, title);
    await this.bodyService.put(id, body);

    return this.getArticle(id);
  }

  async update(user: User, id: mongoose.Types.ObjectId, { topic: topicName, title, body }: UpdateArticleDto) {
    const topic = await this.topicService.getOrCreate(user, topicName);
    await this.noteService.update(id, topic.name, title);
    await this.bodyService.remove(id);
    await this.bodyService.put(id, body);

    return this.getArticle(id);
  }

  async remove(id: mongoose.Types.ObjectId): Promise<void> {
    const note = await this.noteService.getNote(id);
    if (!note) throw new NotFoundException();

    return this.noteService.remove(id);
  }

  async getArticle(id: mongoose.Types.ObjectId): Promise<ArticleDetail> {
    const note = await this.noteService.getNote(id);
    if (!note) throw new NotFoundException(`Article not found with ${id}`);

    const body = await this.bodyService.get(note._id);
    if (!body) {
      this.noteService.remove(note._id);
      throw new NotFoundException(`Article(${id}) has been expired with.`);
    }

    const profile = this.profileService.getProfile(note.userId);
    const comments = await this.noteService.count({ parent: note._id });
    const { likes, dislikes } = await this.actionService.getEmotionCounts(note._id);

    return {
      id: note._id,
      creator: profile.name,
      topic: note.topic,
      title: note.title,
      body,
      created: note.get('createdAt'),
      updated: note.get('updatedAt'),
      expireTime: note.expireTime,
      children: comments,
      likes,
      dislikes,
    };
  }

  async getArticles(page: number, limit: number) {
    const result = await this.noteService.paginateNotes({ parent: { $exists: false } }, page, limit, '-createdAt');
    const summaries: ArticleSummary[] = await Promise.all(
      result.docs.map(async (note) => {
        const profile = this.profileService.getProfile(note.userId);
        const comments = await this.noteService.count({ parent: note._id });
        const { likes, dislikes } = await this.actionService.getEmotionCounts(note._id);

        return {
          id: note._id,
          creator: profile.name,
          topic: note.topic,
          title: note.title,
          created: note.get('createdAt'),
          updated: note.get('updatedAt'),
          expireTime: note.expireTime,
          children: comments,
          likes,
          dislikes,
        };
      }),
    );

    return {
      page: result.page || -1,
      pageSize: result.limit,
      totalPages: result.totalPages,
      summaries,
    };
  }
}
