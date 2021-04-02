import { ReportType } from '../action/interfaces/report-type.interface';

export class Restriction {
  constructor(readonly period: Date, readonly reasons: ReportType[]) {}
}
