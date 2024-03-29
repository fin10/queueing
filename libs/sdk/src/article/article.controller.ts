import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import mongoose from 'mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleService } from './article.service';
import { UserAuthGuard } from '../user/user-auth.guard';
import { User } from '../user/schemas/user.schema';
import { GetArticlesDto } from './dto/get-articles.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { PoliciesGuard } from '../policy/policies.guard';
import { CheckPolicies } from '../policy/decorators/check-policies.decorator';
import { CreateArticlePolicyHandler } from '../policy/handlers/create-article-policy.handler';
import { DeleteArticlePolicyHandler } from '../policy/handlers/delete-article-policy.handler';
import { UpdateArticlePolicyHandler } from '../policy/handlers/update-article-policy.handler';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @UseGuards(UserAuthGuard, PoliciesGuard)
  @CheckPolicies(new CreateArticlePolicyHandler())
  @Post()
  create(@Req() req: Request, @Body() dto: CreateArticleDto) {
    const user = req.user as User;
    return this.service.create(user, dto);
  }

  @UseGuards(UserAuthGuard, PoliciesGuard)
  @CheckPolicies(new UpdateArticlePolicyHandler())
  @Put(':id')
  update(
    @Req() req: Request,
    @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId,
    @Body() dto: UpdateArticleDto,
  ) {
    const user = req.user as User;
    return this.service.update(user, id, dto);
  }

  @UseGuards(UserAuthGuard, PoliciesGuard)
  @CheckPolicies(new DeleteArticlePolicyHandler())
  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    await this.service.remove(id);
    return id;
  }

  @Get(':id')
  getArticleDetail(@Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    return this.service.getArticle(id);
  }

  @Get()
  getArticleSummaries(@Query() query: GetArticlesDto) {
    return this.service.getArticles(query.page, query.pageSize);
  }
}
