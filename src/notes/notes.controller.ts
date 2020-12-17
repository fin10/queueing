import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
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

  @Get(':id')
  async getNote(@Param('id') id: string): Promise<Note> {
    if (!id) throw new BadRequestException('id cannot be null.');

    const note = await this.service.getNote(id);
    if (!note) throw new NotFoundException(`${id} not found.`);

    return note;
  }

  @Get()
  getNotes(): Promise<Note[]> {
    return this.service.getNotes();
  }
}
