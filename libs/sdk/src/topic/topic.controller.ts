import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { RawTopic } from './schemas/topic.schema';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Get()
  getTopics(): Promise<RawTopic[]> {
    return this.topicService.getTopics();
  }
}
