import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NotesService } from './notes.service';
import { Note } from './schemas/note.schema';

@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  createNotes(@Body() data: CreateNoteDto): Promise<Note> {
    return this.service.create(data);
  }

  @Get()
  getNotes(): Promise<Note[]> {
    return this.service.getNotes();
  }
}
