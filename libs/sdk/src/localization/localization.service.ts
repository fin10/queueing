import { Injectable } from '@nestjs/common';
import { Locale } from './enums/locale.enum';
import { EnumFactory } from './interfaces/enum.factory';
import { KoKrLocalizationFactory } from './ko-kr-localization.factory';

@Injectable()
export default class LocalizationService {
  private readonly enums: { [key: string]: EnumFactory } = {};

  constructor(readonly koKrLocalizationFactory: KoKrLocalizationFactory) {
    this.enums[Locale['ko-KR']] = koKrLocalizationFactory;
  }

  enum(locale: Locale): EnumFactory {
    const factory = this.enums[locale];
    if (!factory) throw new Error(`Not found localizations for ${locale}`);

    return factory;
  }
}
