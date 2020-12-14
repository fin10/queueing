import { Controller, Get } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './schemas/note.schema';

@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Get()
  getNotes(): Promise<Note[]> {
    return this.service.getNotes();
  }
}
