import { Module } from '@nestjs/common';
import { NoteModule } from 'src/note/note.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [NoteModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
