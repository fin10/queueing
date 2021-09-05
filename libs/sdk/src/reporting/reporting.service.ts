import { Injectable, NotFoundException } from '@nestjs/common';
import _ from 'underscore';
import mongoose, { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { ReportType } from './enums/report-type.enum';
import LocalizationService from '../localization/localization.service';
import { Locale } from '../localization/enums/locale.enum';
import { Reporting, ReportingDocument } from './schemas/reporting.schema';
import { InjectModel } from '@nestjs/mongoose';
import { ReportingTargetType } from './enums/reporting-target-type.enum';

@Injectable()
export class ReportingService {
  constructor(
    @InjectModel(Reporting.name) private readonly model: Model<ReportingDocument>,
    private readonly localization: LocalizationService,
  ) {}

  async reportArticle(
    reporter: User,
    targetId: mongoose.Types.ObjectId,
    targetUserId: mongoose.Types.ObjectId,
    type: ReportType,
  ) {
    await this.report(reporter._id, ReportingTargetType.ARTICLE, targetId, targetUserId, type);
  }

  async reportComment(
    reporter: User,
    targetId: mongoose.Types.ObjectId,
    targetUserId: mongoose.Types.ObjectId,
    type: ReportType,
  ) {
    await this.report(reporter._id, ReportingTargetType.COMMENT, targetId, targetUserId, type);
  }

  async getReporting(id: mongoose.Types.ObjectId): Promise<Reporting> {
    const reporting = await this.model.findById(id).lean();
    if (!reporting) throw new NotFoundException(`Reporting not found: ${id}`);
    return reporting;
  }

  findReportings(targetUserId: mongoose.Types.ObjectId): Promise<Reporting[]> {
    return this.model.find({ targetUserId }).lean();
  }

  getReportTypes(locale: Locale) {
    return _.values(ReportType).map((type) => ({
      code: type,
      text: this.localization.enum(locale).reportType(type),
    }));
  }

  private async report(
    reporterId: mongoose.Types.ObjectId,
    targetType: ReportingTargetType,
    targetId: mongoose.Types.ObjectId,
    targetUserId: mongoose.Types.ObjectId,
    type: ReportType,
  ) {
    await this.model.create({ reporterId, targetType, targetId, targetUserId, type });
  }
}
