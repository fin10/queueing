import { ReportType } from '../action/enums/report-type.enum';

export class Restriction {
  constructor(readonly period: Date, readonly reasons: ReportType[]) {}
}
