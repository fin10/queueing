import { Injectable, Logger, PayloadTooLargeException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Topic, TopicDocument } from './schemas/topic.schema';
import { User } from '../user/schemas/user.schema';
import { MongoErrorCode } from '../exceptions/mongo-error.code';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/env.validation';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  private readonly topicMaxLength: number;

  constructor(
    @InjectModel(Topic.name) private readonly model: Model<TopicDocument>,
    config: ConfigService<EnvironmentVariables>,
  ) {
    this.topicMaxLength = config.get<number>('QUEUEING_TOPIC_MAX_LENGTH');
  }

  getTopics(): Promise<TopicDocument[]> {
    return this.model.find().lean();
  }

  async getOrCreate(user: User, name: string): Promise<Topic> {
    if (name.length > this.topicMaxLength) {
      throw new PayloadTooLargeException(`Length of 'topic' should be lower then ${this.topicMaxLength}`);
    }

    const exists = await this.model.exists({ name });
    if (!exists) {
      try {
        await this.model.create({ userId: user._id, name });
      } catch (err) {
        if (err.code === MongoErrorCode.DUPLICATE_KEY) {
          this.logger.warn(`Topic already exists: ${name}`);
        } else {
          this.logger.error(`Failed to create topic: ${name}`, err.stack);
          throw err;
        }
      }
    }

    return this.model.findOne({ name }).lean();
  }

  async remove(id: mongoose.Types.ObjectId) {
    await this.model.remove({ _id: id });
  }
}
