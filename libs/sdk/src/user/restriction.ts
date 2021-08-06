import { ReportType } from '../reporting/enums/report-type.enum';

export class Restriction {
  constructor(readonly period: Date, readonly reasons: ReportType[]) {}
}
