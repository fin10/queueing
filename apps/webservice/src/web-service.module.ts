import path from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { QueueingConfigModule } from '@lib/sdk/config/queueing-config.module';
import { LoggerModule } from '@lib/sdk/logger/logger.module';
import { CommentModule } from '@lib/sdk/comment/comment.module';
import { ArticleModule } from '@lib/sdk/article/article.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigKey, QueueingConfigService } from '@lib/sdk/config/queueing-config.service';
import { TopicModule } from '@lib/sdk/topic/topic.module';
import { CleanerModule } from '@lib/sdk/cleaner/cleaner.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ActionModule } from '@lib/sdk/action/action.module';
import { AuthModule } from '@lib/sdk/auth/auth.module';

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
      rootPath: path.resolve('dist', 'client'),
      exclude: ['/api*'],
    }),
    CommentModule,
    ArticleModule,
    TopicModule,
    CleanerModule,
    ActionModule,
    AuthModule,
  ],
})
export class WebServiceModule {}