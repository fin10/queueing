import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database.module';
import { NoteModel } from './note-model.service';
import { RawNote, RawNoteSchema } from './schemas/raw-note.schema';

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: RawNote.name, schema: RawNoteSchema }])],
  providers: [NoteModel],
  exports: [NoteModel],
})
export class NoteModelModule {}
