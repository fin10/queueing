import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NoteWithBody } from './interfaces/note.interface';

@Controller('comments')
export class CommentsController {
  constructor(private readonly service: CommentsService) {}

  @Post()
  create(@Body() data: CreateCommentDto): Promise<string> {
    return this.service.create(data);
  }

  @Get(':parentId')
  async getComments(@Param('parentId') id: string): Promise<NoteWithBody[]> {
    if (!id) throw new BadRequestException('parentId cannot be null.');

    return this.service.getComments(id);
  }
}
