import { ReportType } from '@lib/sdk/reporting/enums/report-type.enum';

export interface EnumFactory {
  reportType(type: ReportType): string;
}
