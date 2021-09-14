import { ReportingType } from '@lib/sdk/reporting/enums/reporting-type.enum';

export interface EnumFactory {
  reportType(type: ReportingType): string;
}
