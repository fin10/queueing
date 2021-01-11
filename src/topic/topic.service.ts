import { Injectable } from '@nestjs/common';
import { NoteModel } from 'src/note/note-model.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { RawTopic } from './schemas/topic.schema';
import { TopicModel } from './topic.model';

@Injectable()
export class TopicService {
  constructor(private readonly topicModel: TopicModel, private readonly noteModel: NoteModel) {}

  create(data: CreateTopicDto): Promise<RawTopic> {
    return this.topicModel.create(data);
  }

  async getTopics(): Promise<RawTopic[]> {
    const topics = await this.topicModel.getTopics();

    return topics.map((topic) => {
      const count = this.noteModel.count({ topic: topic.name });
      return {
        ...topic,
        count,
      };
    });
  }

  async getOrCreate(name: string): Promise<RawTopic> {
    const rawTopic = await this.topicModel.findOne({ name });
    if (rawTopic) return rawTopic;

    return this.topicModel.create({ name });
  }
}
