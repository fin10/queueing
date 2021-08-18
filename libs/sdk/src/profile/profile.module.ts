import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import redisStore from 'cache-manager-ioredis';
import { EnvironmentVariables } from '../config/env.validation';
import { NicknameService } from './nickname.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables>) => {
        const redisEnabled = config.get<boolean>('QUEUEING_REDIS_ENABLED');
        if (!redisEnabled) return { store: 'memory' };

        return {
          store: redisStore,
          host: config.get('QUEUEING_REDIS_HOST'),
          port: config.get('QUEUEING_REDIS_PORT'),
        };
      },
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, NicknameService],
  exports: [ProfileService],
})
export class ProfileModule {}
