import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
import moment from 'moment';
import { ConfigKey, QueueingConfigService } from 'src/config/queueing-config.service';
import { NoteRemovedEvent } from './events/note-removed.event';

@Injectable()
export class NoteBodyService {
  private readonly logger = new Logger(NoteBodyService.name);

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache, private readonly config: QueueingConfigService) {}

  put(key: string, body: string): Promise<void> {
    const ttl = this.config.getInteger(ConfigKey.NOTE_TTL);
    return this.cache.set(key, body, { ttl });
  }

  remove(id: string): Promise<void> {
    return this.cache.del(id);
  }

  get(key: string): Promise<string | null> {
    return this.cache.get(key);
  }

  @OnEvent(NoteRemovedEvent.name, { nextTick: true })
  async onNoteRemoved(event: NoteRemovedEvent): Promise<void> {
    const start = moment();
    await this.cache.del(event.getId());
    this.logger.debug(`Removed note body with ${event.getId()} in ${moment().diff(start, 'ms')}ms`);
  }
}
