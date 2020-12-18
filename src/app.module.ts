import path from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotesModule } from './notes/notes.module';
import { ConfigKey, QueueingConfigService } from './queueing-config/queueing-config.service';
import { QueueingConfigModule } from './queueing-config/queueing-config.module';

@Module({
  imports: [
    QueueingConfigModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'client'),
      exclude: ['/api*'],
    }),
    MongooseModule.forRootAsync({
      imports: [QueueingConfigModule],
      inject: [QueueingConfigService],
      useFactory: (config: QueueingConfigService) => ({ uri: config.get<string>(ConfigKey.MONGODB_URI) }),
    }),
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService, QueueingConfigService],
})
export class AppModule {}
