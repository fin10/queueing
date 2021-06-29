import { Module } from '@nestjs/common';
import { CommentModule } from '@lib/sdk/comment/comment.module';
import { ArticleModule } from '@lib/sdk/article/article.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicModule } from '@lib/sdk/topic/topic.module';
import { ActionModule } from '@lib/sdk/action/action.module';
import { DummyModule } from './dummy/dummy.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from '@lib/sdk/user/user.module';
import { utilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables, validate } from '@lib/sdk/config/env.validation';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        utilities.format.nestLike('queueing'),
      ),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({ isGlobal: true, validate }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables>) => ({
        uri: config.get('QUEUEING_MONGODB_URI'),
        auth: {
          user: config.get('QUEUEING_MONGODB_USER'),
          password: config.get('QUEUEING_MONGODB_PASSWORD'),
        },
        authSource: config.get('QUEUEING_MONGODB_AUTH_DB'),
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
