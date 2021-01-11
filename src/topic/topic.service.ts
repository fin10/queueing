import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NoteModel } from 'src/note/note-model.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { RawTopic, RawTopicDocument } from './schemas/topic.schema';

@Injectable()
export class TopicService {
  constructor(
    @InjectModel(RawTopic.name) private model: Model<RawTopicDocument>,
    private readonly noteModel: NoteModel,
  ) {}

  async create(data: CreateTopicDto): Promise<RawTopic> {
    const topic = new this.model(data);
    await topic.save();

    return topic;
  }

  async getTopics(): Promise<RawTopic[]> {
    const topics = await this.model.find().lean();

    return Promise.all(
      topics.map(async (topic) => {
        const count = await this.noteModel.count({ topic: topic.name });
        return {
          ...topic,
          count,
        };
      }),
    );
  }

  async getOrCreate(name: string): Promise<RawTopic> {
    const rawTopic = await this.model.findOne({ name }).lean();
    if (rawTopic) return rawTopic;

    return this.create({ name });
  }
}
