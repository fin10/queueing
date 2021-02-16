import _ from 'underscore';
import { Mutex } from 'async-mutex';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteService } from '../note/note.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { RawTopic, RawTopicDocument } from './schemas/topic.schema';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class TopicService {
  private readonly mutex = new Mutex();

  constructor(
    @InjectModel(RawTopic.name) private readonly model: Model<RawTopicDocument>,
    private readonly noteService: NoteService,
  ) {}

  async create(data: CreateTopicDto): Promise<RawTopic> {
    const topic = new this.model(data);
    await topic.save();

    return topic;
  }

  async getTopics(): Promise<RawTopic[]> {
    return _.chain(await this.getTopicsWithCount())
      .filter(({ count }) => count)
      .sortBy((topic) => -(topic.count || 0))
      .value();
  }

  async getOrCreate(user: User, name: string): Promise<RawTopic> {
    return this.mutex.runExclusive(async () => {
      const rawTopic = await this.model.findOne({ name }).lean();
      if (rawTopic) return rawTopic;

      return this.create({ userId: user.id, name });
    });
  }

  async removeEmptyTopics(): Promise<number> {
    const topics = _.chain(await this.getTopicsWithCount())
      .filter(({ count = 0 }) => count === 0)
      .value();

    Promise.all(topics.map((topic) => this.model.deleteOne({ _id: topic._id })));

    return topics.length;
  }

  private async getTopicsWithCount(): Promise<RawTopic[]> {
    const topics: RawTopic[] = await this.model.find().lean();

    return Promise.all(
      topics.map(async (topic) => {
        const count = await this.noteService.count({ topic: topic.name });
        return { ...topic, count };
      }),
    );
  }
}
