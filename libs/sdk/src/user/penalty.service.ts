import _ from 'underscore';
import moment from 'moment';
import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { Restriction } from './restriction';
import { ReportType } from '../action/interfaces/report-type.interface';
import { Locale } from '../localization/enums/locale.enum';
import LocalizationService from '../localization/localization.service';

@Injectable()
export class PenaltyService {
  constructor(private readonly userService: UserService, private readonly localization: LocalizationService) {}

  async impose(
    userId: mongoose.Types.ObjectId,
    duration: moment.Duration,
    reasons: ReportType[],
  ): Promise<Restriction> {
    const period = moment.utc().add(duration);
    const restriction = new Restriction(period.toDate(), reasons);
    await this.userService.updateRestriction(userId, restriction);

    return restriction;
  }

  getReportTypes(locale: Locale): { type: ReportType; text: string }[] {
    return _.values(ReportType).map((type) => ({
      type,
      text: this.localization.enum(locale).reportType(type),
    }));
  }
}
