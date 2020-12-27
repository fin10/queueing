import { InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { QueueingLogger } from './logger/queueing-logger.service';
import { ConfigKey, QueueingConfigService } from './config/queueing-config.service';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(QueueingLogger);
  app.useLogger(logger);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const port = app.get(QueueingConfigService).getInteger(ConfigKey.PORT);
  if (!port) throw new InternalServerErrorException('port is not defined.');

  await app.listen(port, () => {
    logger.verbose(`Service listening on ${port}`);
  });
};

bootstrap();
