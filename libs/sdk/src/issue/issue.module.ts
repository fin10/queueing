import { Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { JiraModule } from '../jira/jira.module';
import { NoteModule } from '../note/note.module';
import { IssueService } from './issue.service';

@Module({
  imports: [NoteModule, ActionModule, JiraModule],
  providers: [IssueService],
})
export class IssueModule {}
