import _ from 'underscore';
import fs from 'fs';
import path from 'path';
import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';

class Dictionary {
  static Name = {
    CHARACTERISTICS: 'characteristics.dict',
    COLORS: 'colors.dict',
    ANIMALS: 'animals.dict',
  };

  private constructor(private readonly words: string[]) {}

  static load(name: string): Dictionary {
    const nicknamePath = path.resolve('resources', 'nickname');
    const lines = fs.readFileSync(path.join(nicknamePath, name), { encoding: 'utf-8' }).split('\n');
    const words = _.chain(lines)
      .map((line) => line.trim())
      .compact()
      .uniq()
      .value();

    return new Dictionary(words);
  }

  choice(): string {
    return _.chain(this.words).sample(1).first().value() || 'empty';
  }

  getSize(): number {
    return this.words.length;
  }
}

@Injectable()
export class NicknameService {
  private readonly ttl: number;
  private readonly dictionaries: Dictionary[];

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache, config: ConfigService<EnvironmentVariables>) {
    this.ttl = config.get<number>('QUEUEING_NICKNAME_TTL');
    this.dictionaries = [Dictionary.Name.CHARACTERISTICS, Dictionary.Name.COLORS, Dictionary.Name.ANIMALS].map(
      Dictionary.load,
    );
  }

  async getNickname(userId: mongoose.Types.ObjectId) {
    const id = userId.toHexString();
    const cached = await this.cache.get<string>(id);
    if (cached) return cached;

    const suffix = id.substring(id.length - 4);
    const name = this.dictionaries.map((dict) => dict.choice()).join(' ');
    const nickname = `${name} (${suffix})`;
    await this.cache.set(id, nickname, { ttl: this.ttl });

    return nickname;
  }
}
