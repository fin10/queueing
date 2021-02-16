import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, Req } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Note } from '../note/dto/note.dto';
import { ArticleService } from './article.service';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../user/user-auth.guard';
import { Request } from 'express';
import { User } from '../user/schemas/user.schema';
import { ArticlesResponse } from './interfaces/articles-response.interface';

@Controller('article')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @UseGuards(UserAuthGuard)
  @Post()
  createOrUpdate(@Req() req: Request, @Body() data: CreateArticleDto): Promise<string> {
    const user = req.user as User;

    if (data.id) return this.service.update(user, data.id, data);
    return this.service.create(user, data);
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string): Promise<void> {
    const user = req.user as User;
    return this.service.remove(user, id);
  }

  @Get(':id')
  async getNote(@Param('id') id: string): Promise<Note> {
    return this.service.getArticle(id);
  }

  @Get()
  getNotes(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Promise<ArticlesResponse> {
    return this.service.getArticles(page, pageSize);
  }
}
