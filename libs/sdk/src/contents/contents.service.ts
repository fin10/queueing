import { CACHE_MANAGER, Inject, Injectable, Logger, PayloadTooLargeException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import moment from 'moment';
import mongoose from 'mongoose';
import { ArticleRemovedEvent } from '../article/events/article-removed.event';
import { CommentRemovedEvent } from '../comment/events/comment-removed.event';
import { EnvironmentVariables } from '../config/env.validation';
import { ContentsEntity } from './contents.entity';

@Injectable()
export class ContentsService {
  private readonly logger = new Logger(ContentsService.name);

  private readonly ttl: number;
  private readonly maxLength: number;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache, config: ConfigService<EnvironmentVariables>) {
    this.ttl = config.get<number>('QUEUEING_NOTE_TTL');
    this.maxLength = config.get<number>('QUEUEING_NOTE_MAX_LENGTH');
  }

  async put(id: mongoose.Types.ObjectId, body: string) {
    if (body.length > this.maxLength) {
      throw new PayloadTooLargeException(`Length of contents should be lower then ${this.maxLength}`);
    }

    const entities = this.parseEntities(body);
    await this.cache.set<ContentsEntity[]>(id.toHexString(), entities, { ttl: this.ttl });
  }

  async remove(id: mongoose.Types.ObjectId) {
    const start = moment();
    await this.cache.del(id.toHexString());
    this.logger.debug(`Removed contents with ${id} in ${moment().diff(start, 'ms')}ms`);
  }

  get(id: mongoose.Types.ObjectId): Promise<ContentsEntity[] | null> {
    return this.cache.get<ContentsEntity[]>(id.toHexString());
  }

  @OnEvent(ArticleRemovedEvent.name, { nextTick: true })
  async onArticleRemoved(event: ArticleRemovedEvent) {
    this.remove(event.id);
  }

  @OnEvent(CommentRemovedEvent.name, { nextTick: true })
  async onCommentRemoved(event: CommentRemovedEvent) {
    this.remove(event.id);
  }

  private parseEntities(contents: string) {
    return contents.split(/(https?:\/\/[^\s]+)/).map((line) => {
      try {
        const url = new URL(line);
        if (/\.(jpe?g|gif|png)$/i.test(url.pathname)) {
          return ContentsEntity.image(url.href);
        } else if (/\.(ogg|webm|mp4)$/i.test(url.pathname)) {
          return ContentsEntity.video(url.href);
        } else if (/www\.youtube\.com/i.test(url.hostname)) {
          return ContentsEntity.youtube(url.href);
        } else {
          return ContentsEntity.link(url.href);
        }
      } catch (_) {
        return ContentsEntity.string(line);
      }
    });
  }
}
