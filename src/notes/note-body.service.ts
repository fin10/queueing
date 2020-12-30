import moment from 'moment';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ConfigKey, QueueingConfigService } from 'src/config/queueing-config.service';

@Injectable()
export class NoteBodyService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache, private readonly config: QueueingConfigService) {}

  put(key: string, body: string): Promise<void> {
    return this.cache.set(key, body, { ttl: this.getExpireTime() });
  }

  get(key: string): Promise<string | null> {
    return this.cache.get(key);
  }

  private getExpireTime(): number {
    const clearTimeHour = this.config.getInteger(ConfigKey.CLEAR_TIME_HOUR);
    const clearTime = moment({ hour: clearTimeHour }).add(1, 'd');
    return clearTime.diff(moment(), 's');
  }
}
