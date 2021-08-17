import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserAuthGuard } from '../user/user-auth.guard';
import { User } from '../user/schemas/user.schema';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { PoliciesGuard } from '../policy/policies.guard';
import { CheckPolicies } from '../policy/decorators/check-policies.decorator';
import { CreateCommentPolicyHandler } from '../policy/handlers/create-comment-policy.handler';
import { DeleteCommentPolicyHandler } from '../policy/handlers/delete-comment-policy.handler';
import { NoteService } from '../note/note.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly service: CommentService, private readonly noteService: NoteService) {}

  @UseGuards(UserAuthGuard, PoliciesGuard)
  @CheckPolicies(new CreateCommentPolicyHandler())
  @Post()
  async create(@Req() req: Request, @Body() data: CreateCommentDto) {
    const user = req.user as User;

    await this.validateArticleId(data.articleId);
    return this.service.create(user, data);
  }

  @UseGuards(UserAuthGuard, PoliciesGuard)
  @CheckPolicies(new DeleteCommentPolicyHandler())
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    await this.service.remove(id);
    return id;
  }

  @Get()
  async getComments(@Query('articleId', ParseObjectIdPipe) articleId: mongoose.Types.ObjectId) {
    await this.validateArticleId(articleId);
    return this.service.getComments(articleId);
  }

  private async validateArticleId(articleId: mongoose.Types.ObjectId) {
    if (!(await this.noteService.exists(articleId))) {
      throw new NotFoundException(`Article not found with ${articleId}`);
    }
  }
}
