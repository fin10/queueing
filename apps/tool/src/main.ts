import _ from 'underscore';
import { NestFactory } from '@nestjs/core';
import { UserService } from '@lib/sdk/user/user.service';
import { ToolModule } from './tool.module';
import { ClienDataFetcher } from './dummy/clien-data.fetcher';
import { ArticleService } from '@lib/sdk/article/article.service';
import { QueueingLogger } from '@lib/sdk/logger/queueing-logger.service';

const bootstrap = async () => {
  const app = await NestFactory.create(ToolModule);
  const logger = app.get(QueueingLogger);

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
        const found = await userService.findUser(nickname);
        if (found) return;

        await userService.createUser(nickname);
        logger.debug(`User registered: ${nickname}`);
      }),
    );

    const articleService = app.get(ArticleService);
    await Promise.all(
      dummies.map(async (data) => {
        const user = { id: data.nickname };
        await articleService.create(user, data);
        logger.debug(`Article registered: [${data.topic}] ${data.title}`);
      }),
    );
  } catch (err) {
    logger.error(err.stack);
  } finally {
    process.exit();
  }
};

bootstrap();