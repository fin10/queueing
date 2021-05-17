import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { NoteModule } from '../note/note.module';
import { RawAction, RawActionSchema } from './schemas/raw-action.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActionCreatedEvent } from './events/action-created.event';
import { LocalizationModule } from '../localization/localization.module';

@Module({
  imports: [
    NoteModule,
    LocalizationModule,
    MongooseModule.forFeatureAsync([
      {
        imports: [EventEmitter2],
        inject: [EventEmitter2],
        name: RawAction.name,
        useFactory: (eventEmitter: EventEmitter2) => {
          const schema = RawActionSchema;

          schema.post('save', (doc: RawAction) => {
            eventEmitter.emit(ActionCreatedEvent.name, new ActionCreatedEvent(doc._id, doc.name));
          });

          return schema;
        },
        collection: 'actions',
      },
    ]),
  ],
  providers: [ActionService],
  controllers: [ActionController],
  exports: [ActionService],
})
export class ActionModule {}
