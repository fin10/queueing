import session from 'express-session';
import passport from 'passport';
import { InternalServerErrorException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigKey, QueueingConfigService } from '@lib/sdk/config/queueing-config.service';
import { WebServiceModule } from './web-service.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

const bootstrap = async () => {
  const app = await NestFactory.create(WebServiceModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const config = app.get(QueueingConfigService);

  app.use(session({ secret: config.getString(ConfigKey.AUTH_SECRET), resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.useLogger(logger);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = config.getInteger(ConfigKey.PORT);
  if (!port) throw new InternalServerErrorException('port is not defined.');

  const environment = config.getString(ConfigKey.NODE_ENV);

  await app.listen(port, () => {
    logger.verbose(`Service environment: ${environment}`);
    logger.verbose(`Service listening on ${port}`);
  });
};

bootstrap();
