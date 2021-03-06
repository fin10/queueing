import { Module } from '@nestjs/common';
import { NicknameService } from './nickname.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, NicknameService],
  exports: [ProfileService],
})
export class ProfileModule {}
