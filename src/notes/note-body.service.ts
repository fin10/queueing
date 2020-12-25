import moment from 'moment';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class NoteBodyService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async put(body: string): Promise<string> {
    const key = moment().valueOf().toString();
    await this.cache.set(key, body, { ttl: moment.duration(1, 'd').asSeconds() });
    return key;
  }

  get(key: string): Promise<string | null> {
    return this.cache.get(key);
  }
}
