import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import _ from 'underscore';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  async getTopics() {
    const topics = await this.topicService.getTopics();
    if (!topics.length) return [];

    const counts = await this.topicService.getNoteCountsByTopic(topics);

    return _.chain(topics)
      .filter(({ name }) => counts[name])
      .sortBy(({ name }) => -(counts[name] || 0))
      .map(({ name }) => ({ name, count: counts[name] }))
      .value();
  }
}
