import { Body, Controller, Delete, Get, Param, Post, Req, UnauthorizedException } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { Note } from 'src/note/dto/note.dto';
import { ArticleService } from './article.service';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { Request } from 'express';
import { User } from 'src/user/schemas/user.schema';

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
