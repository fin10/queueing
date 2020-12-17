import { InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const port = app.get<ConfigService>(ConfigService).get<number>('PORT');
  if (!port) throw new InternalServerErrorException('port is not defined.');

  await app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
}
bootstrap();
