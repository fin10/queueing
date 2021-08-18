import { Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { CommentModule } from '../comment/comment.module';
import { NoteModule } from '../note/note.module';
import { PolicyModule } from '../policy/policy.module';
import { ProfileModule } from '../profile/profile.module';
import { TopicModule } from '../topic/topic.module';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [NoteModule, TopicModule, ActionModule, ProfileModule, PolicyModule, CommentModule],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
