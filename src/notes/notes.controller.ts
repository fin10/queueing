import { Body, Controller, Get, Post } from '@nestjs/common';
import { NotesService } from './notes.service';
import { Note } from './schemas/note.schema';

@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  createNotes(@Body() data: { title: string }): Promise<Note> {
    return this.service.create(data);
  }

  @Get()
  getNotes(): Promise<Note[]> {
    return this.service.getNotes();
  }
}
