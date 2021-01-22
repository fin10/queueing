import path from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueingConfigModule } from './config/queueing-config.module';
import { LoggerModule } from './logger/logger.module';
import { CommentModule } from './comment/comment.module';
import { ArticleModule } from './article/article.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigKey, QueueingConfigService } from './config/queueing-config.service';
import { TopicModule } from './topic/topic.module';
import { CleanerModule } from './cleaner/cleaner.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ActionModule } from './action/action.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    LoggerModule,
    QueueingConfigModule,
    MongooseModule.forRootAsync({
      imports: [QueueingConfigModule],
      inject: [QueueingConfigService],
      useFactory: (config: QueueingConfigService) => ({
        uri: config.getString(ConfigKey.MONGODB_URI),
        useCreateIndex: true,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'client'),
      exclude: ['/api*'],
    }),
    CommentModule,
    ArticleModule,
    TopicModule,
    CleanerModule,
    ActionModule,
  ],
})
export class AppModule {}
