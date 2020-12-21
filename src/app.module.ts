import path from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { NotesModule } from './notes/notes.module';
import { QueueingConfigModule } from './config/queueing-config.module';
import { LoggerModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { QueueingConfigService, ConfigKey } from './config/queueing-config.service';

@Module({
  imports: [
    LoggerModule,
    QueueingConfigModule,
    MongooseModule.forRootAsync({
      imports: [QueueingConfigModule],
      inject: [QueueingConfigService],
      useFactory: (config: QueueingConfigService) => ({ uri: config.get<string>(ConfigKey.MONGODB_URI) }),
    }),
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'client'),
      exclude: ['/api*'],
    }),
    NotesModule,
  ],
})
export class AppModule {}
