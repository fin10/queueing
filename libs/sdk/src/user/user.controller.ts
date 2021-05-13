import mongoose from 'mongoose';
import { Body, Controller, DefaultValuePipe, Get, Param, Post, UseGuards, Query } from '@nestjs/common';
import { PenaltyService } from './penalty.service';
import { Restriction } from './restriction';
import { ImposePenaltyDto } from './dto/impose-penalty.dto';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { UserAuthGuard } from './user-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { Locale } from '../localization/enums/locale.enum';
import { ReportType } from '../action/interfaces/report-type.interface';

interface Response {
  readonly userId: string;
  readonly restriction: Restriction;
}

@Controller('user')
@UseGuards(UserAuthGuard)
@Roles(Role.Admin)
export class UserController {
  constructor(private readonly penaltyService: PenaltyService) {}

  @Post('penalty/:userId')
  async penalty(
    @Param('userId', ParseObjectIdPipe) userId: mongoose.Types.ObjectId,
    @Body() body: ImposePenaltyDto,
  ): Promise<Response> {
    const { duration, reasons } = body;
    const restriction = await this.penaltyService.impose(userId, duration, reasons);
    return { userId: userId.toHexString(), restriction };
  }

  @Get('penalty/reportTypes')
  reportTypes(
    @Query('locale', new DefaultValuePipe(Locale['ko-KR'])) locale: Locale,
  ): { type: ReportType; text: string }[] {
    return this.penaltyService.getReportTypes(locale);
  }
}
