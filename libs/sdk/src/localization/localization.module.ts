import { Module } from '@nestjs/common';
import { KoKrLocalizationFactory } from './ko-kr-localization.factory';
import LocalizationService from './localization.service';

@Module({
  providers: [LocalizationService, KoKrLocalizationFactory],
  exports: [LocalizationService],
})
export class LocalizationModule {}
