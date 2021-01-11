import _ from 'underscore';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteService } from 'src/note/note.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { RawTopic, RawTopicDocument } from './schemas/topic.schema';

@Injectable()
export class TopicService {
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
    const topics = await this.model.find().lean();

    return _.chain(
      await Promise.all(
        topics.map(async (topic) => {
          const count = await this.noteService.count({ topic: topic.name });
          if (!count) return null;

          return { ...topic, count };
        }),
      ),
    )
      .compact()
      .sortBy((topic) => -topic.count)
      .value();
  }

  async getOrCreate(name: string): Promise<RawTopic> {
    const rawTopic = await this.model.findOne({ name }).lean();
    if (rawTopic) return rawTopic;

    return this.create({ name });
  }
}
