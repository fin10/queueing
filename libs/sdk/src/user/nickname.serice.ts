import _ from 'underscore';
import fs from 'fs';
import path from 'path';
import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';

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

  public getNickname(user: User): string {
    const id = user._id.toString();
    const suffix = id.substring(id.length - 4);
    const name = this.dictionaries.map((dict) => _.sample(dict, 1)).join(' ');
    const nickname = `${name} (${suffix})`;
    return nickname;
  }
}
