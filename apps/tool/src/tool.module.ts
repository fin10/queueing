import { Module } from '@nestjs/common';
import { QueueingConfigModule } from '@lib/sdk/config/queueing-config.module';
import { LoggerModule } from '@lib/sdk/logger/logger.module';
import { CommentModule } from '@lib/sdk/comment/comment.module';
import { ArticleModule } from '@lib/sdk/article/article.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigKey, QueueingConfigService } from '@lib/sdk/config/queueing-config.service';
import { TopicModule } from '@lib/sdk/topic/topic.module';
import { ActionModule } from '@lib/sdk/action/action.module';
import { DummyModule } from './dummy/dummy.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from '@lib/sdk/user/user.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    LoggerModule,
    QueueingConfigModule,
    MongooseModule.forRootAsync({
      imports: [QueueingConfigModule],
      inject: [QueueingConfigService],
      useFactory: (config: QueueingConfigService) => ({
        uri: config.getString(ConfigKey.MONGODB_URI),
        auth: {
          user: config.getString(ConfigKey.MONGODB_USER),
          password: config.getString(ConfigKey.MONGODB_PASSWORD),
        },
        authSource: config.getString(ConfigKey.MONGODB_AUTH_DB),
        useCreateIndex: true,
      }),
    }),
    CommentModule,
    ArticleModule,
    TopicModule,
    ActionModule,
    UserModule,
    DummyModule,
  ],
})
export class ToolModule {}
