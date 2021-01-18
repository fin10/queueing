import { Module } from '@nestjs/common';
import { NoteModule } from 'src/note/note.module';
import { TopicModule } from 'src/topic/topic.module';
import { CleanerService } from './cleaner.service';

@Module({
  imports: [NoteModule, TopicModule],
  providers: [CleanerService],
})
export class CleanerModule {}
