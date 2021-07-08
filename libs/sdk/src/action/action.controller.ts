import { Controller, DefaultValuePipe, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserAuthGuard } from '../user/user-auth.guard';
import { User } from '../user/schemas/user.schema';
import { ActionService } from './action.service';
import { EmotionType } from './interfaces/emotion-type.interface';
import { ReportType } from './interfaces/report-type.interface';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { Locale } from '../localization/enums/locale.enum';

@UseGuards(UserAuthGuard)
@Controller('action')
export class ActionController {
  constructor(private readonly action: ActionService) {}

  @Post('/like/:id')
  async like(@Req() req: Request, @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    const user = req.user as User;
    const likes = await this.action.putEmotion(user, id, EmotionType.LIKE);
    return { id, likes };
  }

  @Post('/dislike/:id')
  async dislike(@Req() req: Request, @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId) {
    const user = req.user as User;
    const dislikes = await this.action.putEmotion(user, id, EmotionType.DISLIKE);
    return { id, dislikes };
  }

  @Get('/report/types')
  reportTypes(
    @Query('locale', new DefaultValuePipe(Locale['ko-KR'])) locale: Locale,
  ): { code: ReportType; text: string }[] {
    return this.action.getReportTypes(locale);
  }

  @Post('/report/:id/:type')
  async report(
    @Req() req: Request,
    @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId,
    @Param('type') type: ReportType,
  ): Promise<void> {
    const user = req.user as User;
    return this.action.putReport(user, id, type);
  }
}
