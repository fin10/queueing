import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteBodyService } from './note-body.service';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { RawNote, RawNoteSchema } from './schemas/raw-note.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: RawNote.name, schema: RawNoteSchema }])],
  controllers: [NotesController],
  providers: [NotesService, NoteBodyService],
})
export class NotesModule {}
