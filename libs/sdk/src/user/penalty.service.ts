import moment from 'moment';
import mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { Restriction } from './restriction';
import { ReportType } from '../action/enums/report-type.enum';

@Injectable()
export class PenaltyService {
  constructor(private readonly userService: UserService) {}

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
}
