import { Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { NoteModule } from '../note/note.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [NoteModule, ActionModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
