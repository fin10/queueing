import { Injectable } from '@nestjs/common';
import _ from 'underscore';
import mongoose from 'mongoose';
import { ActionName } from '../action/enums/action-name.enum';
import { User } from '../user/schemas/user.schema';
import { ReportType } from './enums/report-type.enum';
import LocalizationService from '../localization/localization.service';
import { ActionService } from '../action/action.service';
import { Locale } from '../localization/enums/locale.enum';

@Injectable()
export class ReportingService {
  constructor(private readonly actionService: ActionService, private readonly localization: LocalizationService) {}

  async putReport(user: User, type: ReportType, targetId: mongoose.Types.ObjectId) {
    await this.actionService.putAction(user, ActionName.REPORT, type, targetId);
  }

  findReportings(user: User) {
    return this.actionService.findActions(user, ActionName.REPORT);
  }

  getReportTypes(locale: Locale) {
    return _.values(ReportType).map((type) => ({
      code: type,
      text: this.localization.enum(locale).reportType(type),
    }));
  }
}
