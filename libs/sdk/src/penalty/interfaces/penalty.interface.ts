import { ReportingType } from '@lib/sdk/reporting/enums/reporting-type.enum';

export interface Penalty {
  readonly type: ReportingType;
  readonly count: number;
  readonly term: number;
}
