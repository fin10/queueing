import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Note } from '../note/dto/note.dto';
import { ArticleService } from './article.service';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../user/user-auth.guard';
import { Request } from 'express';
import { User } from '../user/schemas/user.schema';
import { ArticlesResponse } from './interfaces/articles-response.interface';
import { GetArticlesDto } from './dto/get-articles.dto';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { PoliciesGuard } from '../policy/policies.guard';
import { CheckPolicies } from '../policy/decorators/check-policies.decorator';
import { CreateNotePolicyHandler } from '../policy/handlers/create-note-policy.handler';
import { DeleteNotePolicyHandler } from '../policy/handlers/delete-note-policy.handler';
import { UpdateNotePolicyHandler } from '../policy/handlers/update-policy.handler';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @UseGuards(UserAuthGuard)
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new CreateNotePolicyHandler())
  @Post()
  create(@Req() req: Request, @Body() dto: CreateArticleDto) {
    const user = req.user as User;
    return this.service.create(user, dto);
  }

  @UseGuards(UserAuthGuard)
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new UpdateNotePolicyHandler())
  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId,
    @Body() dto: UpdateArticleDto,
  ) {
    const user = req.user as User;
    return this.service.update(user, id, dto);
  }

  @UseGuards(UserAuthGuard)
  @UseGuards(PoliciesGuard)
  @CheckPolicies(new DeleteNotePolicyHandler())
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    await this.service.remove(id);

    return { id };
  }

  @Get(':id')
  getNote(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId): Promise<Note> {
    return this.service.getArticle(id);
  }

  @Get()
  getNotes(@Query() query: GetArticlesDto): Promise<ArticlesResponse> {
    return this.service.getArticles(query.page, query.pageSize);
  }
}
