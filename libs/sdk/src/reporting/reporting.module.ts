import { Module } from '@nestjs/common';
import { ActionModule } from '../action/action.module';
import { LocalizationModule } from '../localization/localization.module';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';

@Module({
  imports: [ActionModule, LocalizationModule],
  controllers: [ReportingController],
  providers: [ReportingService],
  exports: [ReportingService],
})
export class ReportingModule {}
