import { Module } from '@nestjs/common';
import { ActionModule } from 'src/action/action.module';
import { NoteModule } from 'src/note/note.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [NoteModule, ActionModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
