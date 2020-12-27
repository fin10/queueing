import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueingConfigModule } from 'src/config/queueing-config.module';
import { QueueingConfigService, ConfigKey } from 'src/config/queueing-config.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [QueueingConfigModule],
      inject: [QueueingConfigService],
      useFactory: (config: QueueingConfigService) => ({ uri: config.getString(ConfigKey.MONGODB_URI) }),
    }),
  ],
})
export class DatabaseModule {}
