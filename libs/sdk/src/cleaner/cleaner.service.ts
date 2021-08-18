import moment from 'moment';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TopicService } from '../topic/topic.service';
import { ArticleService } from '../article/article.service';

@Injectable()
export class CleanerService {
  private readonly logger = new Logger(CleanerService.name);

  constructor(private readonly articleService: ArticleService, private readonly topicService: TopicService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanArticles() {
    this.logger.verbose(`Cleaning expired articles...`);

    const start = moment();
    const articles = await this.articleService.findArticles({ expireTime: { $lte: moment.utc().toDate() } });
    await Promise.all(articles.map((article) => article.remove()));

    this.logger.verbose(`Completed to clean expired articles (${articles.length}) in ${moment().diff(start, 'ms')}ms`);
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanTopics() {
    this.logger.verbose(`Cleaning empty topics...`);

    const start = moment();

    const topics = await this.topicService.getTopics();
    const deleted = (
      await Promise.all(
        topics.map(async (topic) => {
          const count = await this.articleService.count({ topic: topic.name });
          if (count) return 0;
          await this.topicService.remove(topic._id);
          return 1;
        }),
      )
    ).reduce((sum, cur) => sum + cur, 0);

    this.logger.verbose(`Completed to clean empty topics (${deleted}) in ${moment().diff(start, 'ms')}ms`);
  }
}
