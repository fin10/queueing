import redisStore from 'cache-manager-ioredis';
import { CacheModule, Module } from '@nestjs/common';
import { NoteBodyService } from './note-body.service';
import { NoteModelModule } from 'src/database/note-model.module';
import { ConfigKey, QueueingConfigService } from 'src/config/queueing-config.service';
import { QueueingConfigModule } from 'src/config/queueing-config.module';

@Module({
  imports: [
    NoteModelModule,
    CacheModule.registerAsync({
      imports: [QueueingConfigModule],
      inject: [QueueingConfigService],
      useFactory: (config: QueueingConfigService) => {
        const redisEnabled = config.getBoolean(ConfigKey.REDIS_ENABLED);
        if (!redisEnabled) return { store: 'memory' };

        return {
          store: redisStore,
          host: config.getString(ConfigKey.REDIS_HOST),
          port: config.getInteger(ConfigKey.REDIS_PORT),
        };
      },
    }),
  ],
  providers: [NoteBodyService],
  exports: [NoteBodyService],
})
export class NotesModule {}
