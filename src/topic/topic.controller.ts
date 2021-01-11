import { Get } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { RawTopic } from './schemas/topic.schema';
import { TopicService } from './topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  create(@Body() data: CreateTopicDto): Promise<void> {
    return this.topicService.create(data);
  }

  @Get()
  getTopics(): Promise<RawTopic[]> {
    return this.topicService.getTopics();
  }
}
