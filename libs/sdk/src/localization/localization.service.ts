import { Injectable } from '@nestjs/common';
import { Locale } from './enums/locale.enum';
import { MessageBuilder } from './interfaces/message.builder';
import { KoKrMessageBuilder } from './ko-kr-message.builder';

@Injectable()
export default class LocalizationService {
  private readonly messages: { [key: string]: MessageBuilder } = {};

  constructor(readonly koKrMessageBuilder: KoKrMessageBuilder) {
    this.messages[Locale['ko-KR']] = koKrMessageBuilder;
  }

  message(locale: Locale): MessageBuilder {
    const builder = this.messages[locale];
    if (!builder) throw new Error(`Not found localizations for ${locale}`);

    return builder;
  }
}
