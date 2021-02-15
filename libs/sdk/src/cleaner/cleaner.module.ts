import { Module } from '@nestjs/common';
import { NoteModule } from '../note/note.module';
import { TopicModule } from '../topic/topic.module';
import { CleanerService } from './cleaner.service';

@Module({
  imports: [NoteModule, TopicModule],
  providers: [CleanerService],
})
export class CleanerModule {}
