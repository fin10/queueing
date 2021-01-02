import { Module } from '@nestjs/common';
import { NoteModelModule } from 'src/database/note-model.module';
import { NotesModule } from 'src/notes/notes.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [NoteModelModule, NotesModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
