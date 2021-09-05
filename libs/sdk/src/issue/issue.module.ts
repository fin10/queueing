import { Module } from '@nestjs/common';
import { ArticleModule } from '../article/article.module';
import { CommentModule } from '../comment/comment.module';
import { JiraModule } from '../jira/jira.module';
import { ReportingModule } from '../reporting/reporting.module';
import { IssueService } from './issue.service';

@Module({
  imports: [ArticleModule, CommentModule, ReportingModule, JiraModule],
  providers: [IssueService],
})
export class IssueModule {}
