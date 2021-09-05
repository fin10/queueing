import { ReportType } from '@lib/sdk/reporting/enums/report-type.enum';

export interface Penalty {
  readonly type: ReportType;
  readonly count: number;
  readonly term: number;
}
