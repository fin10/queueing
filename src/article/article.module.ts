import { Module } from '@nestjs/common';
import { NoteModule } from 'src/note/note.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [NoteModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}