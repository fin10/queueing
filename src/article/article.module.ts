import { Module } from '@nestjs/common';
import { ActionModule } from 'src/action/action.module';
import { NoteModule } from 'src/note/note.module';
import { TopicModule } from 'src/topic/topic.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [NoteModule, TopicModule, ActionModule],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
