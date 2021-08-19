import redisStore from 'cache-manager-ioredis';
import { CacheModule, Module } from '@nestjs/common';
import { ContentsService } from './contents.service';
import { EnvironmentVariables } from '../config/env.validation';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [ContentsService],
  exports: [ContentsService],
})
export class ContentsModule {}
