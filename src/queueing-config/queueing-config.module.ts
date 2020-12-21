import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueingConfigService, validate } from './queueing-config.service';

@Module({
  imports: [ConfigModule.forRoot({ validate })],
  providers: [ConfigService, QueueingConfigService],
  exports: [QueueingConfigService],
})
export class QueueingConfigModule {}
