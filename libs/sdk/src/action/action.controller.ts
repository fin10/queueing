import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserAuthGuard } from '../user/user-auth.guard';
import { User } from '../user/schemas/user.schema';
import { ActionService } from './action.service';
import { EmotionType } from './interfaces/emotion-type.interface';
import { ReportType } from './interfaces/report-type.interface';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';

@UseGuards(UserAuthGuard)
@Controller('action')
export class ActionController {
  constructor(private readonly action: ActionService) {}

  @Post('/like/:id')
  async like(@Req() req: Request, @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId): Promise<void> {
    const user = req.user as User;
    return this.action.putEmotion(user, id, EmotionType.LIKE);
  }

  @Post('/dislike/:id')
  async dislike(@Req() req: Request, @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId): Promise<void> {
    const user = req.user as User;
    return this.action.putEmotion(user, id, EmotionType.DISLIKE);
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
