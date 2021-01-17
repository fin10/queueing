import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Cache } from 'cache-manager';
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

  get(key: string): Promise<string | null> {
    return this.cache.get(key);
  }

  @OnEvent('note.removed')
  onNoteRemoved(event: NoteRemovedEvent): void {
    this.logger.debug(`Received note removed event: ${event.getId()}`);
    this.cache.del(event.getId());
  }
}
