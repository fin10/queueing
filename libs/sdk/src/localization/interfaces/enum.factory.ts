import { ReportType } from '@lib/sdk/action/enums/report-type.enum';

export interface EnumFactory {
  reportType(type: ReportType): string;
}
