import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Note } from 'src/note/dto/note.dto';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

  @Post()
  create(@Body() data: CreateArticleDto): Promise<string> {
    return this.service.create(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }

  @Get(':id')
  async getNote(@Param('id') id: string): Promise<Note> {
    return this.service.getArticle(id);
  }

  @Get()
  getNotes(): Promise<Note[]> {
    return this.service.getArticles();
  }
}
