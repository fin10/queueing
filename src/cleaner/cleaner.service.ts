import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NoteService } from 'src/note/note.service';

@Injectable()
export class CleanerService {
  private readonly logger = new Logger(CleanerService.name);

  constructor(private readonly noteService: NoteService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanNotes(): Promise<void> {
    this.logger.verbose(`Cleaning expired notes...`);
    const count = await this.noteService.removeExpiredNotes();
    this.logger.verbose(`Completed to clean expired notes (${count})`);
  }
}
