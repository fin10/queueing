import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateTopicDto } from './dto/create-topic.dto';
import { RawTopic, RawTopicDocument } from './schemas/topic.schema';

@Injectable()
export class TopicModel {
  constructor(@InjectModel(RawTopic.name) private model: Model<RawTopicDocument>) {}

  async create(data: CreateTopicDto): Promise<RawTopic> {
    const topic = new this.model(data);
    await topic.save();

    return topic;
  }

  async getTopics(): Promise<RawTopic[]> {
    return this.model.find().lean();
  }

  async findOne<T>(filter: FilterQuery<T>): Promise<RawTopic | null> {
    return this.model.findOne(filter).lean();
  }
}
