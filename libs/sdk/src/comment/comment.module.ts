import { Module } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ActionModule } from '../action/action.module';
import { NoteModule } from '../note/note.module';
import { PolicyModule } from '../policy/policy.module';
import { ProfileModule } from '../profile/profile.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentRemovedEvent } from './events/comment-removed.event';
import { Comment, CommentDocument, CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    NoteModule,
    ActionModule,
    ProfileModule,
    PolicyModule,
    MongooseModule.forFeatureAsync([
      {
        imports: [EventEmitter2],
        inject: [EventEmitter2],
        name: Comment.name,
        useFactory: (eventEmitter: EventEmitter2) => {
          const schema = CommentSchema;

          schema.post('remove', (doc: CommentDocument) => {
            eventEmitter.emit(CommentRemovedEvent.name, new CommentRemovedEvent(doc._id));
          });

          return schema;
        },
        collection: 'comments',
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
