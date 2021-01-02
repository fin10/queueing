import path from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { NotesModule } from './notes/notes.module';
import { QueueingConfigModule } from './config/queueing-config.module';
import { LoggerModule } from './logger/logger.module';
import { DatabaseModule } from './database/database.module';
import { CommentModule } from './comment/comment.module';
import { ArticleModule } from './article/article.module';

@Module({
  imports: [
    LoggerModule,
    QueueingConfigModule,
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'client'),
      exclude: ['/api*'],
    }),
    CommentModule,
    ArticleModule,
  ],
})
export class AppModule {}
