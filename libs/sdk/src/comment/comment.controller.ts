import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Note } from '../note/dto/note.dto';
import { UserAuthGuard } from '../user/user-auth.guard';
import { User } from '../user/schemas/user.schema';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';

@Controller('comment')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @UseGuards(UserAuthGuard)
  @Post()
  create(@Req() req: Request, @Body() data: CreateCommentDto): Promise<mongoose.Types.ObjectId> {
    const user = req.user as User;
    return this.service.create(user, data);
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId): Promise<void> {
    const user = req.user as User;
    return this.service.remove(user, id);
  }

  @Get('/article/:id')
  getComments(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId): Promise<Note[]> {
    return this.service.getComments(id);
  }

  @Get(':id')
  getComment(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId): Promise<Note> {
    return this.service.getComment(id);
  }
}
