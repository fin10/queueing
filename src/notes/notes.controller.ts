import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { Note } from './interfaces/note.interface';
import { NotesService } from './notes.service';
import { RawNote } from './schemas/raw-note.schema';

@Controller('notes')
export class NotesController {
  constructor(private readonly service: NotesService) {}

  @Post()
  create(@Body() data: CreateNoteDto): Promise<RawNote> {
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
