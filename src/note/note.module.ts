import redisStore from 'cache-manager-ioredis';
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueingConfigModule } from 'src/config/queueing-config.module';
import { ConfigKey, QueueingConfigService } from 'src/config/queueing-config.service';
import { NoteService } from './note.service';
import { RawNote, RawNoteSchema } from './schemas/raw-note.schema';
import { NoteBodyService } from './note-body.service';
import { Schema } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [QueueingConfigModule],
        inject: [QueueingConfigService],
        name: RawNote.name,
        useFactory: (config: QueueingConfigService) => {
          const ttl = config.getInteger(ConfigKey.NOTE_TTL_MINS);
          const schema: Schema<RawNote> = RawNoteSchema;
          schema.index({ createdAt: 1 }, { expires: `${ttl}m` });
          return schema;
        },
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
