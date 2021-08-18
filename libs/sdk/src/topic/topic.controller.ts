import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import _ from 'underscore';
import { ArticleService } from '../article/article.service';
import { Topic } from './schemas/topic.schema';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService, private articleService: ArticleService) {}

  @Get()
  async getTopics() {
    const topics = await this.topicService.getTopics();
    if (!topics.length) return [];

    const counts = await this.getCountsByTopic(topics);

    return _.chain(topics)
      .filter(({ name }) => counts[name])
      .sortBy(({ name }) => -(counts[name] || 0))
      .map(({ name }) => ({ name, count: counts[name] }))
      .value();
  }

  private async getCountsByTopic(topics: Topic[]) {
    const names = topics.map(({ name }) => name);
    const counts = await Promise.all(names.map((name) => this.articleService.count({ topic: name })));

    return _.object(names, counts);
  }
}
