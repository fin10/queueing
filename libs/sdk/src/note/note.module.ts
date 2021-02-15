import redisStore from 'cache-manager-ioredis';
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueingConfigModule } from '../config/queueing-config.module';
import { ConfigKey, QueueingConfigService } from '../config/queueing-config.service';
import { NoteService } from './note.service';
import { RawNote, RawNoteSchema } from './schemas/raw-note.schema';
import { NoteBodyService } from './note-body.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NoteRemovedEvent } from './events/note-removed.event';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [EventEmitter2],
        inject: [EventEmitter2],
        name: RawNote.name,
        useFactory: (eventEmitter: EventEmitter2) => {
          const schema = RawNoteSchema;
          schema.post('remove', (doc: RawNote) => {
            eventEmitter.emit(NoteRemovedEvent.name, new NoteRemovedEvent(doc._id));
          });

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
