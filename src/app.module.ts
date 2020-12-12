import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'client'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
