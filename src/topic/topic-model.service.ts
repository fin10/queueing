import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopicDto } from './dto/create-topic.dto';
import { Topic, TopicDocument } from './schemas/topic.schema';

@Injectable()
export class TopicModelService {
  constructor(@InjectModel(Topic.name) private model: Model<TopicDocument>) {}

  create(data: CreateTopicDto): Promise<Topic> {
    return this.model.create(data);
  }

  async getTopics(): Promise<Topic[]> {
    return this.model.find().lean();
  }
}
