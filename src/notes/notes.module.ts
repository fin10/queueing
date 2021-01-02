import redisStore from 'cache-manager-ioredis';
import { CacheModule, Module } from '@nestjs/common';
import { NoteBodyService } from './note-body.service';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NoteModelModule } from 'src/database/note-model.module';
import { ConfigKey, QueueingConfigService } from 'src/config/queueing-config.service';
import { QueueingConfigModule } from 'src/config/queueing-config.module';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';

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
  controllers: [NotesController, CommentsController],
  providers: [NotesService, NoteBodyService, CommentsService],
})
export class NotesModule {}
