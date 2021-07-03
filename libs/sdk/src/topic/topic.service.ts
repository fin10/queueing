import _ from 'underscore';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteService } from '../note/note.service';
import { RawTopic, RawTopicDocument } from './schemas/topic.schema';
import { User } from '../user/schemas/user.schema';
import { MongoErrorCode } from '../exceptions/mongo-error.code';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name);

  constructor(
    @InjectModel(RawTopic.name) private readonly model: Model<RawTopicDocument>,
    private readonly noteService: NoteService,
  ) {}

  async getTopics() {
    const topics = await this.getTopicsWithCount();

    return _.chain(topics)
      .filter(({ count }) => count)
      .sortBy((topic: RawTopic) => -(topic.count || 0))
      .value();
  }

  async getOrCreate(user: User, name: string) {
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

  async removeEmptyTopics() {
    const topics = (await this.getTopicsWithCount()).filter(({ count = 0 }) => count === 0);

    Promise.all(topics.map((topic: RawTopic) => this.model.deleteOne({ _id: topic._id })));

    return topics.length;
  }

  private async getTopicsWithCount() {
    const topics = await this.model.find().lean();

    return Promise.all(
      topics.map(async (topic: RawTopicDocument) => {
        const count = await this.noteService.count({ topic: topic.name });
        return { ...topic, count };
      }),
    );
  }
}
