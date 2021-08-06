import { Body, Controller, DefaultValuePipe, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserAuthGuard } from '../user/user-auth.guard';
import { User } from '../user/schemas/user.schema';
import { ReportType } from './enums/report-type.enum';
import mongoose from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { Locale } from '../localization/enums/locale.enum';
import { ReportingService } from './reporting.service';

@Controller('report')
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get('/types')
  reportTypes(
    @Query('locale', new DefaultValuePipe(Locale['ko-KR'])) locale: Locale,
  ): { code: ReportType; text: string }[] {
    return this.reportingService.getReportTypes(locale);
  }

  @UseGuards(UserAuthGuard)
  @Post()
  async report(
    @Req() req: Request,
    @Body('targetId', ParseObjectIdPipe) targetId: mongoose.Types.ObjectId,
    @Body('type') type: ReportType,
  ): Promise<void> {
    const user = req.user as User;
    return this.reportingService.putReport(user, type, targetId);
  }
}
