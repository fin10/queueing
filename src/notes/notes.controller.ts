import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteResponse } from './interfaces/note-response.interface';
import { Note } from './interfaces/note.interface';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  create(@Body() data: CreateNoteDto): Promise<string> {
    return this.service.create(data);
  }

  @Get(':id')
  async getNote(@Param('id') id: string): Promise<NoteResponse> {
    if (!id) throw new BadRequestException('id cannot be null.');

    const note = await this.service.getNote(id);
    const body = await this.service.getNoteBody(id);

    return { note, body };
  }

  @Get()
  getNotes(): Promise<Note[]> {
    return this.service.getNotes();
  }
}
