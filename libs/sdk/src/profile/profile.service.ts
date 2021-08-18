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

  async getProfile(userId: mongoose.Types.ObjectId) {
    const nickname = await this.nicknameService.getNickname(userId);
    return {
      id: userId,
      name: nickname,
    };
  }
}
