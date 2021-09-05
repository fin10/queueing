import _ from 'underscore';
import mongoose from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { JiraService } from '../jira/jira.service';
import { ArticleService } from '../article/article.service';
import { CommentService } from '../comment/comment.service';
import { ArticleDetail } from '../article/interfaces/article-detail.interface';
import { CommentDetail } from '../comment/interfaces/comment-detail.interface';
import { ReportingCreatedEvent } from '../reporting/events/reporting-created.event';
import { ReportingService } from '../reporting/reporting.service';
import { ReportingTargetType } from '../reporting/enums/reporting-target-type.enum';
import { Reporting } from '../reporting/schemas/reporting.schema';

@Injectable()
export class IssueService {
  private readonly logger = new Logger(IssueService.name);

  constructor(
    private readonly reportingService: ReportingService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
    private readonly jiraService: JiraService,
  ) {}

  @OnEvent(ReportingCreatedEvent.name, { nextTick: true })
  async onReportingCreated(event: ReportingCreatedEvent) {
    if (!this.jiraService.isEnabled()) return;

    try {
      const reporting = await this.reportingService.getReporting(event.id);

      switch (reporting.targetType) {
        case ReportingTargetType.ARTICLE:
          await this.postArticleIssue(reporting);
          break;
        case ReportingTargetType.COMMENT:
          await this.postCommentIssue(reporting);
          break;
      }
    } catch (err) {
      this.logger.error(err.message);
    }
  }

  private async findIssueId(id: mongoose.Types.ObjectId) {
    const jql = `issuetype = Report AND summary ~ ${id}`;
    return _.first(await this.jiraService.findIssueIds(jql));
  }

  private async postArticleIssue(reporting: Reporting) {
    const article = await this.articleService.getArticle(reporting.targetId);

    let issueId = await this.findIssueId(article.id);
    if (issueId) {
      await this.updateIssue(issueId, reporting);
    } else {
      issueId = await this.createArticleIssue(reporting, article);
    }

    const commentId = await this.addComment(issueId, reporting);
    this.logger.verbose(`Issue posted: ${issueId}, comment: ${commentId}`);
  }

  private async createArticleIssue(reporting: Reporting, article: ArticleDetail) {
    const userId = await this.articleService.getUserId(article.id);

    const summary = `[${article.id}] ${article.title}`;
    const contents = _.chain(article.contents)
      .map((entity) => entity.value.trim())
      .compact()
      .value()
      .join('\n');

    const description = _.pairs({
      title: article.title,
      user: userId,
      contents,
    })
      .map(([k, v]) => `[${k}]\n${v}`)
      .join('\n\n');

    const labels = _.pairs({
      user: userId,
      topic: article.topic,
      type: reporting.type,
    })
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${v}`);

    return this.jiraService.createIssue('Report', summary, description, labels);
  }

  private async postCommentIssue(reporting: Reporting) {
    const comment = await this.commentService.getComment(reporting.targetId);

    let issueId = await this.findIssueId(comment.id);
    if (issueId) {
      await this.updateIssue(issueId, reporting);
    } else {
      issueId = await this.createIssueWithComment(reporting, comment);
    }

    const commentId = await this.addComment(issueId, reporting);
    this.logger.verbose(`Issue posted: ${issueId}, comment: ${commentId}`);
  }

  private async createIssueWithComment(reporting: Reporting, comment: CommentDetail) {
    const userId = await this.commentService.getUserId(comment.id);

    const contents = _.chain(comment.contents)
      .map((entity) => entity.value.trim())
      .compact()
      .value()
      .join('\n');

    const summary = `[${comment.id}] ${contents.substring(0, 20)}`;
    const description = _.pairs({
      user: userId,
      contents,
    })
      .map(([k, v]) => `[${k}]\n${v}`)
      .join('\n\n');

    const labels = _.pairs({
      user: userId,
      type: reporting.type,
    })
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${v}`);

    return this.jiraService.createIssue('Report', summary, description, labels);
  }

  private updateIssue(issueId: string, reporting: Reporting) {
    const label = `type:${reporting.type}`;
    return this.jiraService.addLabel(issueId, label);
  }

  private addComment(issueId: string, reporting: Reporting) {
    const description = [`type: ${reporting.type}`, `reported by ${reporting.reporterId}`].join('\n');
    return this.jiraService.addComment(issueId, description);
  }
}
