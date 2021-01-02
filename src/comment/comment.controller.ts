import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
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

  @Get(':parentId')
  async getComments(@Param('parentId') id: string): Promise<Note[]> {
    if (!id) throw new BadRequestException('parentId cannot be null.');

    return this.service.getComments(id);
  }
}
