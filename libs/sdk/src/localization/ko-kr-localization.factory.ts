import { Injectable } from '@nestjs/common';
import { ReportingType } from '../reporting/enums/reporting-type.enum';
import { Restriction } from '../user/restriction';
import { EnumFactory } from './interfaces/enum.factory';
import { MessageFactory } from './interfaces/message.factory';

@Injectable()
export class KoKrLocalizationFactory implements MessageFactory, EnumFactory {
  restriction(restriction: Restriction): string {
    const datetime = restriction.period;
    const message = `다른 사용자의 신고로 ${datetime}까지 이용이 제한됩니다.`;
    return message;
  }

  reportingType(type: ReportingType): string {
    switch (type) {
      case ReportingType.RUDE:
        return '욕설, 비속어, 인신공격, 혐오 발언 사용';
      case ReportingType.AD:
        return '영리 목적의 바이럴 마케팅, 홍보';
      case ReportingType.LEWD:
        return '선정적인 내용';
      case ReportingType.ILLEGAL:
        return '도박, 마약 등의 불법적인 내용';
      case ReportingType.COPYRIGHT:
        return '저작권, 초상권 침해';
      case ReportingType.PLASTERED:
        return '악의적으로 반복적인 내용 게시';
      default:
        throw new Error(`Invalid report type: ${type}`);
    }
  }
}
