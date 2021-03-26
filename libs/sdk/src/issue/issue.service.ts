import _ from 'underscore';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ActionCreatedEvent } from '../action/events/action-created.event';
import { ActionName } from '../action/interfaces/action-name.enum';
import { NoteBodyEntity } from '../note/note-body.entity';
import { NoteBodyService } from '../note/note-body.service';
import { NoteService } from '../note/note.service';
import { RawNote } from '../note/schemas/raw-note.schema';
import { JiraService } from '../jira/jira.service';
import { RawAction } from '../action/schemas/raw-action.schema';
import { ActionService } from '../action/action.service';

@Injectable()
export class IssueService {
  private readonly logger = new Logger(IssueService.name);

  constructor(
    private readonly actionService: ActionService,
    private readonly noteService: NoteService,
    private readonly noteBodyService: NoteBodyService,
    private readonly jiraService: JiraService,
  ) {}

  async postIssue(action: RawAction, note: RawNote, entities: NoteBodyEntity[]): Promise<void> {
    const issueId = await this.createIssue(action, note, entities);
    const commentId = await this.addComment(issueId, action);
    this.logger.verbose(`Issue posted: ${issueId}, comment: ${commentId}`);
  }

  @OnEvent(ActionCreatedEvent.name, { nextTick: true })
  async onActionCreated(event: ActionCreatedEvent): Promise<void> {
    if (!this.jiraService.isEnabled()) return;
    if (event.name !== ActionName.REPORT) return;

    try {
      const action = await this.actionService.getAction(event.id);
      if (!action) throw new NotFoundException(`Action not found with: ${event.id}`);

      const note = await this.noteService.getNote(action.note);
      if (!note) throw new NotFoundException(`Note not found with ${action.note}`);

      const body = await this.noteBodyService.get(note._id);
      if (!body) throw new NotFoundException(`${note._id} has been expired.`);

      await this.postIssue(action, note, body);
    } catch (err) {
      this.logger.error(err.message);
    }
  }

  private createIssue(action: RawAction, note: RawNote, entities: NoteBodyEntity[]) {
    const summary = note._id.toHexString();
    const description = `title: ${note.title}\n\n` + entities.map((entity) => entity.value).join('\n');
    const labels = _.pairs({ user: note.userId.toHexString(), topic: note.topic, type: action.type })
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:${v}`);
    return this.jiraService.createIssue('Report', summary, description, labels);
  }

  private addComment(issueId: string, action: RawAction) {
    const body = [`user: ${action.userId}`, `type: ${action.type}`].join('\n');
    return this.jiraService.addComment(issueId, body);
  }
}
