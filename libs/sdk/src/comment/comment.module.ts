import { Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { NoteModule } from '../note/note.module';
import { PolicyModule } from '../policy/policy.module';
import { ProfileModule } from '../profile/profile.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [NoteModule, ActionModule, ProfileModule, PolicyModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
