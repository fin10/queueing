import { Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { ArticleModule } from '../article/article.module';
import { CommentModule } from '../comment/comment.module';
import { JiraModule } from '../jira/jira.module';
import { IssueService } from './issue.service';

@Module({
  imports: [ArticleModule, CommentModule, ActionModule, JiraModule],
  providers: [IssueService],
})
export class IssueModule {}
