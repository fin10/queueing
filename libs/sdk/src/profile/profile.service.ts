import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { NicknameService } from './nickname.service';

export interface Profile {
  readonly id: ObjectId;
  readonly name: string;
}

@Injectable()
export class ProfileService {
  constructor(private readonly nicknameService: NicknameService) {}

  getProfile(userId: ObjectId): Profile {
    const nickname = this.nicknameService.getNickname(userId);
    return {
      id: userId,
      name: nickname,
    };
  }
}
