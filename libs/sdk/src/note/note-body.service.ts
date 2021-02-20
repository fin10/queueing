import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import moment from 'moment';
import { ConfigKey, QueueingConfigService } from '../config/queueing-config.service';
import { NoteRemovedEvent } from './events/note-removed.event';
import { NoteBodyEntity } from './note-body.entity';

@Injectable()
export class NoteBodyService {
  private readonly logger = new Logger(NoteBodyService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache, private readonly config: QueueingConfigService) {}

  put(key: string, body: string): Promise<void> {
    const ttl = this.config.getInteger(ConfigKey.NOTE_TTL);
    const entities = this.parseEntities(body);
    return this.cache.set<NoteBodyEntity[]>(key, entities, { ttl });
  }

  remove(id: string): Promise<void> {
    return this.cache.del(id);
  }

  get(key: string): Promise<NoteBodyEntity[] | null> {
    return this.cache.get<NoteBodyEntity[]>(key);
  }

  @OnEvent(NoteRemovedEvent.name, { nextTick: true })
  async onNoteRemoved(event: NoteRemovedEvent): Promise<void> {
    const start = moment();
    await this.cache.del(event.getId());
    this.logger.debug(`Removed note body with ${event.getId()} in ${moment().diff(start, 'ms')}ms`);
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
