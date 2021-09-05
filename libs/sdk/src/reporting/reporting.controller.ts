import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { UserAuthGuard } from '../user/user-auth.guard';
import { User } from '../user/schemas/user.schema';
import { ReportType } from './enums/report-type.enum';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { Locale } from '../localization/enums/locale.enum';
import { ReportingService } from './reporting.service';
import { ArticleService } from '../article/article.service';
import { CommentService } from '../comment/comment.service';

@Controller('report')
export class ReportingController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly commentService: CommentService,
    private readonly reportingService: ReportingService,
  ) {}

  @Get('/types')
  reportTypes(
    @Query('locale', new DefaultValuePipe(Locale['ko-KR'])) locale: Locale,
  ): { code: ReportType; text: string }[] {
    return this.reportingService.getReportTypes(locale);
  }

  @UseGuards(UserAuthGuard)
  @Post('/article')
  @HttpCode(HttpStatus.CREATED)
  async reportArticle(
    @Req() req: Request,
    @Body('targetId', ParseObjectIdPipe) targetId: mongoose.Types.ObjectId,
    @Body('type') type: ReportType,
  ) {
    const user = req.user as User;
    const targetUserId = await this.articleService.getUserId(targetId);
    await this.reportingService.reportArticle(user, targetId, targetUserId, type);
  }

  @UseGuards(UserAuthGuard)
  @Post('/comment')
  @HttpCode(HttpStatus.CREATED)
  async reportComment(
    @Req() req: Request,
    @Body('targetId', ParseObjectIdPipe) targetId: mongoose.Types.ObjectId,
    @Body('type') type: ReportType,
  ) {
    const user = req.user as User;
    const targetUserId = await this.commentService.getUserId(targetId);
    await this.reportingService.reportComment(user, targetId, targetUserId, type);
  }
}
