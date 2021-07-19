import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserAuthGuard } from '../user/user-auth.guard';
import { User } from '../user/schemas/user.schema';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { PoliciesGuard } from '../policy/policies.guard';
import { CheckPolicies } from '../policy/decorators/check-policies.decorator';
import { CreateNotePolicyHandler } from '../policy/handlers/create-note-policy.handler';

@Controller('comment')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @UseGuards(UserAuthGuard, PoliciesGuard)
  @CheckPolicies(new CreateNotePolicyHandler())
  @Post()
  create(@Req() req: Request, @Body() data: CreateCommentDto) {
    const user = req.user as User;
    return this.service.create(user, data);
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    await this.service.remove(id);

    return { id };
  }

  @Get()
  getComments(@Query('articleId', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    return this.service.getComments(id);
  }
}
