import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Note } from 'src/note/dto/note.dto';
import { UserAuthGuard } from 'src/user/user-auth.guard';
import { User } from 'src/user/schemas/user.schema';

@Controller('comment')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @UseGuards(UserAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() data: CreateCommentDto): Promise<string> {
    const user = req.user as User;
    return this.service.create(user, data);
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string): Promise<void> {
    const user = req.user as User;
    return this.service.remove(user, id);
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
