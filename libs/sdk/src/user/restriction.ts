import { ReportingType } from '../reporting/enums/reporting-type.enum';

export class Restriction {
  constructor(readonly period: Date, readonly reasons: ReportingType[]) {}
}
