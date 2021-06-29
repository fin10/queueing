import session from 'express-session';
import passport from 'passport';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WebServiceModule } from './web-service.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@lib/sdk/config/env.validation';

const bootstrap = async () => {
  const app = await NestFactory.create(WebServiceModule);

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  const config = app.get<ConfigService<EnvironmentVariables>>(ConfigService);

  app.use(session({ secret: config.get('QUEUEING_AUTH_SECRET'), resave: false, saveUninitialized: false }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.useLogger(logger);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = config.get<number>('PORT');
  const environment = config.get<string>('NODE_ENV');

  await app.listen(port, () => {
    logger.verbose(`Service environment: ${environment}`);
    logger.verbose(`Service listening on ${port}`);
  });
};

bootstrap();
