import { Module } from '@nestjs/common';
import { NoteModule } from 'src/note/note.module';
import { CleanerService } from './cleaner.service';

@Module({
  imports: [NoteModule],
  providers: [CleanerService],
})
export class CleanerModule {}
