import { Module } from '@nestjs/common';
import { ArticleModule } from '../article/article.module';
import { NoteModule } from '../note/note.module';
import { TopicModule } from '../topic/topic.module';
import { CleanerService } from './cleaner.service';

@Module({
  imports: [NoteModule, TopicModule, ArticleModule],
  providers: [CleanerService],
})
export class CleanerModule {}
