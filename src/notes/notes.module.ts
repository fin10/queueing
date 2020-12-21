import { Module } from '@nestjs/common';
import { NoteBodyService } from './note-body.service';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [NotesController],
  providers: [NotesService, NoteBodyService],
})
export class NotesModule {}
