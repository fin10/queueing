import { Module } from '@nestjs/common';
import { NoteBodyService } from './note-body.service';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { NoteModelModule } from 'src/database/note-model.module';

@Module({
  imports: [NoteModelModule],
  controllers: [NotesController],
  providers: [NotesService, NoteBodyService],
})
export class NotesModule {}
