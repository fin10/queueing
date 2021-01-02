import { Module } from '@nestjs/common';
import { NoteModelModule } from 'src/database/note-model.module';
import { NotesModule } from 'src/notes/notes.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [NoteModelModule, NotesModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
