import path from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { NotesModule } from './notes/notes.module';
import { QueueingConfigModule } from './config/queueing-config.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    QueueingConfigModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'client'),
      exclude: ['/api*'],
    }),
    NotesModule,
  ],
})
export class AppModule {}
