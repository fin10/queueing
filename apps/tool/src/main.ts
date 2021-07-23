import _ from 'underscore';
import { NestFactory } from '@nestjs/core';
import { UserService } from '@lib/sdk/user/user.service';
import { ToolModule } from './tool.module';
import { ClienDataFetcher } from './dummy/clien-data.fetcher';
import { ArticleService } from '@lib/sdk/article/article.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

const bootstrap = async () => {
  const app = await NestFactory.create(ToolModule);
  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  try {
    const dataFetcher = app.get(ClienDataFetcher);
    const dummies = await dataFetcher.fetch();

    const users = _.chain(dummies)
      .map((data) => data.nickname)
      .uniq()
      .value();

    const userService = app.get(UserService);
    await Promise.all(
      users.map(async (nickname) => {
        const found = await userService.findUser({ provider: 'clien', key: nickname });
        if (found) return;

        await userService.createUser('clien', nickname);
        logger.debug(`User registered: ${nickname}`);
      }),
    );

    const articleService = app.get(ArticleService);
    await Promise.all(
      dummies.map(async (data) => {
        const user = await userService.findUser({ provider: 'clien', key: data.nickname });
        if (!user) return;

        try {
          await articleService.create(user, data);
          logger.debug(`Article registered: [${data.topic}] ${data.title}`);
        } catch (err) {
          logger.error(`Failed to create article: [${data.topic}] ${data.title}`, err.stack);
        }
      }),
    );
  } catch (err) {
    logger.error(err.stack);
  } finally {
    process.exit();
  }
};

bootstrap();
