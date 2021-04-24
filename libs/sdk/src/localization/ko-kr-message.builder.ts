import { Injectable } from '@nestjs/common';
import { Restriction } from '../user/restriction';
import { MessageBuilder } from './interfaces/message.builder';

@Injectable()
export class KoKrMessageBuilder implements MessageBuilder {
  restriction(restriction: Restriction): string {
    const datetime = restriction.period;
    const message = `다른 사용자의 신고로 ${datetime}까지 이용이 제한됩니다.`;
    return message;
  }
}
