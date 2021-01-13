import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConfigKey, QueueingConfigService } from 'src/config/queueing-config.service';

@Injectable()
export class NoteBodyService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache, private readonly config: QueueingConfigService) {}

  put(key: string, body: string): Promise<void> {
    const ttl = this.config.getInteger(ConfigKey.NOTE_TTL_MINS) * 60;
    return this.cache.set(key, body, { ttl });
  }

  get(key: string): Promise<string | null> {
    return this.cache.get(key);
  }
}
