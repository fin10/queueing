import { Get } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { Topic } from './schemas/topic.schema';
import { TopicModelService } from './topic-model.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicModel: TopicModelService) {}

  @Post()
  create(@Body() data: CreateTopicDto): Promise<Topic> {
    return this.topicModel.create(data);
  }

  @Get()
  getTopics(): Promise<Topic[]> {
    return this.topicModel.getTopics();
  }
}
