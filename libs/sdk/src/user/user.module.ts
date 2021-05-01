import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { UserUpdatedEvent } from './events/user-updated.event';
import { PenaltyService } from './penalty.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        imports: [EventEmitter2],
        inject: [EventEmitter2],
        name: User.name,
        useFactory: (eventEmitter: EventEmitter2) => {
          const schema = UserSchema;

          schema.post('updateOne', (doc: User) => {
            eventEmitter.emit(UserUpdatedEvent.name, new UserUpdatedEvent(doc._id));
          });

          return schema;
        },
        collection: 'users',
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, PenaltyService],
  exports: [UserService],
})
export class UserModule {}
