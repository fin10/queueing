import redisStore from 'cache-manager-ioredis';
import paginate from 'mongoose-paginate-v2';
import { CacheModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteService } from './note.service';
import { Note, NoteDocument, NoteSchema } from './schemas/note.schema';
import { NoteBodyService } from './note-body.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NoteRemovedEvent } from './events/note-removed.event';
import { EnvironmentVariables } from '../config/env.validation';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [EventEmitter2],
        inject: [EventEmitter2],
        name: Note.name,
        useFactory: (eventEmitter: EventEmitter2) => {
          const schema = NoteSchema;

          schema.plugin(paginate);

          schema.post('remove', (doc: NoteDocument) => {
            eventEmitter.emit(NoteRemovedEvent.name, new NoteRemovedEvent(doc._id));
          });

          return schema;
        },
        collection: 'notes',
      },
    ]),
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
  providers: [NoteService, NoteBodyService],
  exports: [NoteService, NoteBodyService],
})
export class NoteModule {}
