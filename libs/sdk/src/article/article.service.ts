import { Injectable, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import mongoose, { FilterQuery } from 'mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { TopicService } from '../topic/topic.service';
import { ActionService } from '../action/action.service';
import { User } from '../user/schemas/user.schema';
import { ProfileService } from '../profile/profile.service';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleDetail } from './interfaces/article-detail.interface';
import { ArticleSummary } from './interfaces/article-summary.interface';
import { ActionName } from '../action/enums/action-name.enum';
import { EmotionType } from '../action/enums/emotion-type.enum';
import { CommentService } from '../comment/comment.service';
import { Article, ArticleDocument } from './schemas/article.schema';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { EnvironmentVariables } from '../config/env.validation';
import moment from 'moment';
import { ContentsService } from '../contents/contents.service';
import { ContentsEntity } from '../contents/contents.entity';

@Injectable()
export class ArticleService {
  private readonly ttl: number;
  private readonly titleMaxLength: number;

  constructor(
    @InjectModel(Article.name) private readonly model: mongoose.PaginateModel<ArticleDocument>,
    private readonly topicService: TopicService,
    private readonly commentService: CommentService,
    private readonly actionService: ActionService,
    private readonly contentsService: ContentsService,
    private readonly profileService: ProfileService,
    config: ConfigService<EnvironmentVariables>,
  ) {
    this.ttl = config.get<number>('QUEUEING_NOTE_TTL');
    this.titleMaxLength = config.get<number>('QUEUEING_TITLE_MAX_LENGTH');
  }

  async create(user: User, { topic: topicName, title, body }: CreateArticleDto) {
    this.validateTitle(title);

    const topic = await this.topicService.getOrCreate(user, topicName);

    const article = await this.model.create({
      userId: user._id,
      topic: topic.name,
      title,
      expireTime: this.getExpireTime(),
    });

    try {
      await this.contentsService.put(article._id, body);
      return this.getArticle(article._id);
    } catch (err) {
      await article.remove();
      throw err;
    }
  }

  async update(user: User, id: mongoose.Types.ObjectId, { topic: topicName, title, body }: UpdateArticleDto) {
    this.validateTitle(title);
    const article = await this.getValidArticle(id);
    const topic = await this.topicService.getOrCreate(user, topicName);
    await article.updateOne({ topic: topic.name, title });

    await this.contentsService.remove(id);
    await this.contentsService.put(id, body);

    return this.getArticle(id);
  }

  async remove(id: mongoose.Types.ObjectId) {
    const article = await this.getValidArticle(id);
    await article.remove();
  }

  async getUserId(id: mongoose.Types.ObjectId) {
    const article = await this.getValidArticle(id);
    return article.userId;
  }

  exists(id: mongoose.Types.ObjectId) {
    const query = { ...this.getValidateFilter(), _id: id };
    return this.model.exists(query);
  }

  count(filter?: FilterQuery<ArticleDocument>): Promise<number> {
    const query = { ...this.getValidateFilter(), ...filter };
    return this.model.countDocuments(query);
  }

  async getArticle(id: mongoose.Types.ObjectId) {
    const article = await this.getValidArticle(id);
    const body = await this.contentsService.get(article._id);
    if (!body) {
      await article.remove();
      throw new NotFoundException(`Article(${article._id}) has been expired.`);
    }

    return this.populateArticleDetail(article, body);
  }

  async getArticles(page: number, limit: number) {
    const result = await this.paginateArticles(page, limit, '-createdAt');
    const summaries: ArticleSummary[] = await Promise.all(
      result.docs.map((article) => this.populateArticleSummary(article)),
    );

    return {
      page: result.page || -1,
      pageSize: result.limit,
      totalPages: result.totalPages,
      summaries,
    };
  }

  findArticles(filter?: FilterQuery<ArticleDocument>) {
    return this.model.find(filter);
  }

  private async getValidArticle(id: mongoose.Types.ObjectId) {
    const query = { ...this.getValidateFilter(), _id: id };
    const article = await this.model.findOne(query);
    if (!article) throw new NotFoundException(`Article not found with ${id}`);

    return article;
  }

  private paginateArticles(page: number, limit: number, sorting?: string) {
    const query = this.getValidateFilter();
    const options = { page, limit, sort: sorting };
    return this.model.paginate(query, options);
  }

  private validateTitle(title: string) {
    if (title.length > this.titleMaxLength) {
      throw new PayloadTooLargeException(`Length of 'title' should be lower then ${this.titleMaxLength}`);
    }
  }

  private getValidateFilter(): FilterQuery<ArticleDocument> {
    return { expireTime: { $gt: moment.utc().toDate() } };
  }

  private getExpireTime(): Date {
    return moment.utc().add(this.ttl, 's').toDate();
  }

  private async populateArticleDetail(article: ArticleDocument, body: ContentsEntity[]): Promise<ArticleDetail> {
    const profile = await this.profileService.getProfile(article.userId);
    const comments = await this.commentService.count({ parent: article._id });
    const likes = await this.actionService.count({
      name: ActionName.EMOTION,
      type: EmotionType.LIKE,
      targetId: article._id,
    });
    const dislikes = await this.actionService.count({
      name: ActionName.EMOTION,
      type: EmotionType.DISLIKE,
      targetId: article._id,
    });

    return {
      id: article._id,
      creator: profile.name,
      topic: article.topic,
      title: article.title,
      body,
      created: article.get('createdAt'),
      updated: article.get('updatedAt'),
      expireTime: article.expireTime,
      children: comments,
      likes,
      dislikes,
    };
  }

  private async populateArticleSummary(article: ArticleDocument): Promise<ArticleSummary> {
    const profile = await this.profileService.getProfile(article.userId);
    const comments = await this.commentService.count({ parent: article._id });
    const likes = await this.actionService.count({
      name: ActionName.EMOTION,
      type: EmotionType.LIKE,
      targetId: article._id,
    });
    const dislikes = await this.actionService.count({
      name: ActionName.EMOTION,
      type: EmotionType.DISLIKE,
      targetId: article._id,
    });

    return {
      id: article._id,
      creator: profile.name,
      topic: article.topic,
      title: article.title,
      created: article.get('createdAt'),
      updated: article.get('updatedAt'),
      expireTime: article.expireTime,
      children: comments,
      likes,
      dislikes,
    };
  }
}
