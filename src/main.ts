import { InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigKey, QueueingConfigService } from './queueing-config/queueing-config.service';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const port = app.get(QueueingConfigService).get<number>(ConfigKey.PORT);
  if (!port) throw new InternalServerErrorException('port is not defined.');

  await app.listen(port, () => {
    console.log(`Service listening on ${port}`);
  });
};

bootstrap();
