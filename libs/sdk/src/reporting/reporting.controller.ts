import { Controller, DefaultValuePipe, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserAuthGuard } from '../user/user-auth.guard';
import { User } from '../user/schemas/user.schema';
import { ReportType } from './enums/report-type.enum';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { Locale } from '../localization/enums/locale.enum';
import { ReportingService } from './reporting.service';

@UseGuards(UserAuthGuard)
@Controller('report')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('/types')
  reportTypes(
    @Query('locale', new DefaultValuePipe(Locale['ko-KR'])) locale: Locale,
  ): { code: ReportType; text: string }[] {
    return this.reportingService.getReportTypes(locale);
  }

  @Post('/:id/:type')
  async report(
    @Req() req: Request,
    @Param('id', ParseObjectIdPipe) id: mongoose.Types.ObjectId,
    @Param('type') type: ReportType,
  ): Promise<void> {
    const user = req.user as User;
    return this.reportingService.putReport(user, id, type);
  }
}
