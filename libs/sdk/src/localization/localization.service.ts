import { Injectable } from '@nestjs/common';
import { Locale } from './enums/locale.enum';
import { EnumFactory } from './interfaces/enum.factory';
import { MessageFactory } from './interfaces/message.factory';
import { KoKrLocalizationFactory } from './ko-kr-localization.factory';

@Injectable()
export default class LocalizationService {
  private readonly messages: { [key: string]: MessageFactory } = {};
  private readonly enums: { [key: string]: EnumFactory } = {};

  constructor(readonly koKrLocalizationFactory: KoKrLocalizationFactory) {
    this.messages[Locale['ko-KR']] = koKrLocalizationFactory;
    this.enums[Locale['ko-KR']] = koKrLocalizationFactory;
  }

  message(locale: Locale): MessageFactory {
    const factory = this.messages[locale];
    if (!factory) throw new Error(`Not found localizations for ${locale}`);

    return factory;
  }

  enum(locale: Locale): EnumFactory {
    const factory = this.enums[locale];
    if (!factory) throw new Error(`Not found localizations for ${locale}`);

    return factory;
  }
}
