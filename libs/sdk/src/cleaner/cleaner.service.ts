import moment from 'moment';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NoteService } from '../note/note.service';
import { TopicService } from '../topic/topic.service';

@Injectable()
export class CleanerService {
  private readonly logger = new Logger(CleanerService.name);

  constructor(private readonly noteService: NoteService, private readonly topicService: TopicService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanNotes(): Promise<void> {
    this.logger.verbose(`Cleaning expired notes...`);

    const start = moment();
    const count = await this.noteService.removeExpiredNotes();
    this.logger.verbose(`Completed to clean expired notes (${count}) in ${moment().diff(start, 'ms')}ms`);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanTopics(): Promise<void> {
    this.logger.verbose(`Cleaning empty topics...`);

    const start = moment();
    const count = await this.topicService.removeEmptyTopics();
    this.logger.verbose(`Completed to clean empty topics (${count}) in ${moment().diff(start, 'ms')}ms`);
  }
}
