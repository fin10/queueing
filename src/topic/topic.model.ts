import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTopicDto } from './dto/create-topic.dto';
import { RawTopic, RawTopicDocument } from './schemas/topic.schema';

@Injectable()
export class TopicModel {
  constructor(@InjectModel(RawTopic.name) private model: Model<RawTopicDocument>) {}

  async create(data: CreateTopicDto): Promise<void> {
    const topic = new this.model(data);
    await topic.save();
  }

  async getTopics(): Promise<RawTopic[]> {
    return this.model.find().lean();
  }
}
