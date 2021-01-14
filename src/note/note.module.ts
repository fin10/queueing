import redisStore from 'cache-manager-ioredis';
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueingConfigModule } from 'src/config/queueing-config.module';
import { ConfigKey, QueueingConfigService } from 'src/config/queueing-config.service';
import { NoteService } from './note.service';
import { RawNote, RawNoteSchema } from './schemas/raw-note.schema';
import { NoteBodyService } from './note-body.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RawNote.name,
        schema: RawNoteSchema,
        collection: 'notes',
      },
    ]),
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
  providers: [NoteService, NoteBodyService],
  exports: [NoteService, NoteBodyService],
})
export class NoteModule {}
