import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Note } from '../notes/dto/note.dto';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @Post()
  create(@Body() data: CreateArticleDto): Promise<string> {
    return this.service.create(data);
  }

  @Get(':id')
  async getNote(@Param('id') id: string): Promise<Note> {
    if (!id) throw new BadRequestException('id cannot be null.');

    return this.service.getArticle(id);
  }

  @Get()
  getNotes(): Promise<Note[]> {
    return this.service.getArticles();
  }
}
