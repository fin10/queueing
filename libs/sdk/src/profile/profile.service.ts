import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { NicknameService } from './nickname.service';

export interface Profile {
  readonly id: ObjectId;
  readonly name: string;
}

@Injectable()
export class ProfileService {
  constructor(private readonly nicknameService: NicknameService) {}

  getProfile(user: User): Profile {
    const nickname = this.nicknameService.getNickname(user);
    return {
      id: user._id,
      name: nickname,
    };
  }
}
