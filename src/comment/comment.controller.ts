import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Note } from 'src/note/dto/note.dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post()
  create(@Body() data: CreateCommentDto): Promise<string> {
    return this.service.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Get('/article/:id')
  getComments(@Param('id') id: string): Promise<Note[]> {
    return this.service.getComments(id);
  }

  @Get(':id')
  getComment(@Param('id') id: string): Promise<Note> {
    return this.service.getComment(id);
  }
}
