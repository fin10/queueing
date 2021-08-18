import { CACHE_MANAGER, Inject, Injectable, Logger, PayloadTooLargeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import moment from 'moment';
import mongoose from 'mongoose';
import { ArticleRemovedEvent } from '../article/events/article-removed.event';
import { CommentRemovedEvent } from '../comment/events/comment-removed.event';
import { EnvironmentVariables } from '../config/env.validation';
import { NoteBodyEntity } from './note-body.entity';

@Injectable()
export class NoteBodyService {
  private readonly logger = new Logger(NoteBodyService.name);

  private readonly ttl: number;
  private readonly maxLength: number;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache, config: ConfigService<EnvironmentVariables>) {
    this.ttl = config.get<number>('QUEUEING_NOTE_TTL');
    this.maxLength = config.get<number>('QUEUEING_NOTE_MAX_LENGTH');
  }

  put(id: mongoose.Types.ObjectId, body: string): Promise<void> {
    if (body.length > this.maxLength) {
      throw new PayloadTooLargeException(`Length of 'body' should be lower then ${this.maxLength}`);
    }

    const entities = this.parseEntities(body);
    return this.cache.set<NoteBodyEntity[]>(id.toHexString(), entities, { ttl: this.ttl });
  }

  remove(id: mongoose.Types.ObjectId): Promise<void> {
    return this.cache.del(id.toHexString());
  }

  get(id: mongoose.Types.ObjectId): Promise<NoteBodyEntity[] | null> {
    return this.cache.get<NoteBodyEntity[]>(id.toHexString());
  }

  @OnEvent(ArticleRemovedEvent.name, { nextTick: true })
  async onArticleRemoved(event: ArticleRemovedEvent) {
    const start = moment();
    await this.remove(event.id);
    this.logger.debug(`Removed note body with ${event.id} in ${moment().diff(start, 'ms')}ms`);
  }

  @OnEvent(CommentRemovedEvent.name, { nextTick: true })
  async onCommentRemoved(event: CommentRemovedEvent) {
    const start = moment();
    await this.remove(event.id);
    this.logger.debug(`Removed comment body with ${event.id} in ${moment().diff(start, 'ms')}ms`);
  }

  private parseEntities(body: string): NoteBodyEntity[] {
    return body.split(/(https?:\/\/[^\s]+)/).map((line) => {
      const url = this.parseUrl(line);
      if (!url) return NoteBodyEntity.string(line);
      return this.makeEntity(url);
    });
  }

  private parseUrl(url: string): URL | undefined {
    try {
      return new URL(url);
    } catch (err) {
      // ignore
    }
    return;
  }

  private makeEntity(url: URL): NoteBodyEntity {
    if (/\.(jpe?g|gif|png)$/i.test(url.pathname)) {
      return NoteBodyEntity.image(url.href);
    } else if (/\.(ogg|webm|mp4)$/i.test(url.pathname)) {
      return NoteBodyEntity.video(url.href);
    } else if (/www\.youtube\.com/i.test(url.hostname)) {
      return NoteBodyEntity.youtube(url.href);
    } else {
      return NoteBodyEntity.link(url.href);
    }
  }
}
