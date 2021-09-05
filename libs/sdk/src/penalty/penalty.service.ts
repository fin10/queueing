import { Injectable } from '@nestjs/common';
import _ from 'underscore';
import { User } from '../user/schemas/user.schema';
import { ReportingService } from '../reporting/reporting.service';
import { ReportType } from '../reporting/enums/report-type.enum';

@Injectable()
export class PenaltyService {
  constructor(private readonly reportingService: ReportingService) {}

  async fetchPenalties(user: User) {
    const reportings = await this.reportingService.findReportings(user._id);
    if (!reportings.length) return [];

    const penalties: { [key: string]: { count: number; term: number } } = {};
    reportings.forEach((reporting) => {
      if (!penalties[reporting.type]) penalties[reporting.type] = { count: 0, term: 1 };
      penalties[reporting.type].count += 1;
    });

    return _.pairs(penalties).map(([type, { count, term }]) => ({
      type: ReportType[type],
      count,
      term,
    }));
  }
}
