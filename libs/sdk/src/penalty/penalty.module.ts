import { Module } from '@nestjs/common';
import { ReportingModule } from '../reporting/reporting.module';
import { UserModule } from '../user/user.module';
import { PenaltyController } from './penalty.controller';
import { PenaltyService } from './penalty.service';

@Module({
  imports: [UserModule, ReportingModule],
  controllers: [PenaltyController],
  providers: [PenaltyService],
})
export class PenaltyModule {}
