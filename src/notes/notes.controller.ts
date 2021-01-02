import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note, NoteWithBody } from './interfaces/note.interface';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  create(@Body() data: CreateNoteDto): Promise<string> {
    return this.service.create(data);
  }

  @Get(':id')
  async getNote(@Param('id') id: string): Promise<NoteWithBody> {
    if (!id) throw new BadRequestException('id cannot be null.');

    return this.service.getNote(id);
  }

  @Get()
  getNotes(): Promise<Note[]> {
    return this.service.getNotes();
  }
}
