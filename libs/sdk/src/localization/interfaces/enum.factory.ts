import { ReportType } from '@lib/sdk/action/interfaces/report-type.interface';

export interface EnumFactory {
  reportType(type: ReportType): string;
}
