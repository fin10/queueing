import { Module } from '@nestjs/common';
import { QueueingLogger } from './queueing-logger.service';

@Module({
  providers: [QueueingLogger],
  exports: [QueueingLogger],
})
export class LoggerModule {}
