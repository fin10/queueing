import path from 'path';
import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ScheduleModule } from '@nestjs/schedule';
import { CommentModule } from '@lib/sdk/comment/comment.module';
import { ArticleModule } from '@lib/sdk/article/article.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TopicModule } from '@lib/sdk/topic/topic.module';
import { CleanerModule } from '@lib/sdk/cleaner/cleaner.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ActionModule } from '@lib/sdk/action/action.module';
import { AuthModule } from '@lib/sdk/auth/auth.module';
import { ProfileModule } from '@lib/sdk/profile/profile.module';
import { IssueModule } from '@lib/sdk/issue/issue.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables, validate } from '@lib/sdk/config/env.validation';
import { utilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import morgan from 'morgan';
import { ReportingModule } from '@lib/sdk/reporting/reporting.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY/MM/DD HH:mm:ss.SSSZ' }),
        winston.format.ms(),
        utilities.format.nestLike('queueing'),
      ),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env.development.local', '.env'], validate }),
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
    ServeStaticModule.forRoot({
      rootPath: path.resolve('build'),
      exclude: ['/api*'],
    }),
    CommentModule,
    ArticleModule,
    TopicModule,
    CleanerModule,
    ActionModule,
    ReportingModule,
    AuthModule,
    ProfileModule,
    IssueModule,
  ],
})
export class WebServiceModule implements NestModule {
  private readonly logger = new Logger('HTTP');

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        morgan(
          ':remote-addr ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
          { stream: { write: (msg: string) => this.logger.log(msg) } },
        ),
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
