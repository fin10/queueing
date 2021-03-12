import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { NicknameService } from './nickname.service';

export interface Profile {
  readonly id: mongoose.Types.ObjectId;
  readonly name: string;
}

@Injectable()
export class ProfileService {
  constructor(private readonly nicknameService: NicknameService) {}

  getProfile(userId: mongoose.Types.ObjectId): Profile {
    const nickname = this.nicknameService.getNickname(userId);
    return {
      id: userId,
      name: nickname,
    };
  }
}
