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
    const topics: RawTopicDocument[] = await this.model.find().lean();
    const counts = await this.getNoteCountsByTopic(topics);

    return _.chain(topics)
      .filter(({ name }) => counts[name])
      .sortBy(({ name }) => -(counts[name] || 0))
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
    const topics: RawTopicDocument[] = await this.model.find().lean();
    const counts = await this.getNoteCountsByTopic(topics);

    const shouldDelete = topics.filter(({ name }) => !counts[name]);

    await Promise.all(shouldDelete.map((topic) => this.model.deleteOne({ _id: topic._id })));

    return shouldDelete.length;
  }

  private async getNoteCountsByTopic(topics: RawTopic[]) {
    const names = topics.map(({ name }) => name);
    const counts = await Promise.all(names.map(async (name) => this.noteService.count({ topic: name })));

    return _.object(names, counts);
  }
}
