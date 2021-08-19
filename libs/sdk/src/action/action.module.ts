import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { Action, ActionDocument, ActionSchema } from './schemas/action.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActionCreatedEvent } from './events/action-created.event';
import { LocalizationModule } from '../localization/localization.module';
import { PolicyModule } from '../policy/policy.module';

@Module({
  imports: [
    LocalizationModule,
    PolicyModule,
    MongooseModule.forFeatureAsync([
      {
        imports: [EventEmitter2],
        inject: [EventEmitter2],
        name: Action.name,
        useFactory: (eventEmitter: EventEmitter2) => {
          const schema = ActionSchema;

          schema.post('save', (doc: ActionDocument) => {
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
