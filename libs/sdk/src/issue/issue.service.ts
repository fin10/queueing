import _ from 'underscore';
import mongoose from 'mongoose';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActionCreatedEvent } from '../action/events/action-created.event';
import { ActionName } from '../action/enums/action-name.enum';
import { JiraService } from '../jira/jira.service';
import { Action } from '../action/schemas/action.schema';
import { ActionService } from '../action/action.service';
import { ArticleService } from '../article/article.service';
import { CommentService } from '../comment/comment.service';
import { ArticleDetail } from '../article/interfaces/article-detail.interface';
import { CommentDetail } from '../comment/interfaces/comment-detail.interface';

@Injectable()
export class IssueService {
  private readonly logger = new Logger(IssueService.name);

  constructor(
    private readonly actionService: ActionService,
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
    private readonly jiraService: JiraService,
  ) {}

  @OnEvent(ActionCreatedEvent.name, { nextTick: true })
  async onActionCreated(event: ActionCreatedEvent): Promise<void> {
    if (!this.jiraService.isEnabled()) return;
    if (event.name !== ActionName.REPORT) return;

    try {
      const action = await this.actionService.getAction(event.id);
      if (!action) throw new NotFoundException(`Action not found with: ${event.id}`);

      if (await this.articleService.exists(action.targetId)) {
        await this.postArticleIssue(action);
        return;
      }

      if (await this.commentService.exists(action.targetId)) {
        await this.postCommentIssue(action);
        return;
      }

      throw new NotFoundException(`Not found valid article or comment: ${event.id}`);
    } catch (err) {
      this.logger.error(err.message);
    }
  }

  private async findIssueId(id: mongoose.Types.ObjectId) {
    const jql = `issuetype = Report AND summary ~ ${id}`;
    return _.first(await this.jiraService.findIssueIds(jql));
  }

  private async postArticleIssue(action: Action) {
    const article = await this.articleService.getArticle(action.targetId);

    let issueId = await this.findIssueId(article.id);
    if (issueId) {
      await this.updateIssue(issueId, action);
    } else {
      issueId = await this.createArticleIssue(action, article);
    }

    const commentId = await this.addComment(issueId, action);
    this.logger.verbose(`Issue posted: ${issueId}, comment: ${commentId}`);
  }

  private async createArticleIssue(action: Action, article: ArticleDetail) {
    const userId = await this.articleService.getUserId(article.id);

    const summary = `[${article.id}] ${article.title}`;
    const contents = _.chain(article.body)
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
      type: action.type,
    })
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${v}`);

    return this.jiraService.createIssue('Report', summary, description, labels);
  }

  private async postCommentIssue(action: Action) {
    const comment = await this.commentService.getComment(action.targetId);

    let issueId = await this.findIssueId(comment.id);
    if (issueId) {
      await this.updateIssue(issueId, action);
    } else {
      issueId = await this.createIssueWithComment(action, comment);
    }

    const commentId = await this.addComment(issueId, action);
    this.logger.verbose(`Issue posted: ${issueId}, comment: ${commentId}`);
  }

  private async createIssueWithComment(action: Action, comment: CommentDetail) {
    const userId = await this.commentService.getUserId(comment.id);

    const contents = _.chain(comment.body)
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
      type: action.type,
    })
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${v}`);

    return this.jiraService.createIssue('Report', summary, description, labels);
  }

  private updateIssue(issueId: string, action: Action) {
    const label = `type:${action.type}`;
    return this.jiraService.addLabel(issueId, label);
  }

  private addComment(issueId: string, action: Action) {
    const description = [`type: ${action.type}`, `reported by ${action.userId}`].join('\n');
    return this.jiraService.addComment(issueId, description);
  }
}
