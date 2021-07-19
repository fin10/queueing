import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActionModule } from '../action/action.module';
import { NoteModule } from '../note/note.module';
import { PolicyModule } from '../policy/policy.module';
import { ProfileModule } from '../profile/profile.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from './schemas/comment.schema';

@Module({
  imports: [
    NoteModule,
    ActionModule,
    ProfileModule,
    PolicyModule,
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
        collection: 'comments',
      },
    ]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
