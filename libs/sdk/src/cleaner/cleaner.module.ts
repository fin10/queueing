import { Module } from '@nestjs/common';
import { ArticleModule } from '../article/article.module';
import { TopicModule } from '../topic/topic.module';
import { CleanerService } from './cleaner.service';

@Module({
  imports: [TopicModule, ArticleModule],
  providers: [CleanerService],
})
export class CleanerModule {}
