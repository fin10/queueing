import _ from 'underscore';
import fs from 'fs';
import path from 'path';
import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

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
  private readonly dictionaries: Dictionary[];

  constructor() {
    this.dictionaries = [Dictionary.Name.CHARACTERISTICS, Dictionary.Name.COLORS, Dictionary.Name.ANIMALS].map(
      Dictionary.load,
    );
  }

  public getNickname(userId: mongoose.Types.ObjectId): string {
    const id = userId.toHexString();
    const suffix = id.substring(id.length - 4);
    const name = this.dictionaries.map((dict) => dict.choice()).join(' ');
    const nickname = `${name} (${suffix})`;
    return nickname;
  }
}
