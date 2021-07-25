import moment from 'moment';
import { Injectable, NotFoundException, PayloadTooLargeException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { Note, NoteDocument } from './schemas/note.schema';
import { EnvironmentVariables } from '../config/env.validation';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NoteService {
  private readonly ttl: number;
  private readonly topicMaxLength: number;
  private readonly titleMaxLength: number;

  constructor(
    @InjectModel(Note.name) private readonly model: mongoose.PaginateModel<NoteDocument>,
    config: ConfigService<EnvironmentVariables>,
  ) {
    this.ttl = config.get<number>('QUEUEING_NOTE_TTL');
    this.topicMaxLength = config.get<number>('QUEUEING_TOPIC_MAX_LENGTH');
    this.titleMaxLength = config.get<number>('QUEUEING_TITLE_MAX_LENGTH');
  }

  async create(user: User, topic: string, title: string) {
    this.validateTopic(topic);
    this.validateTitle(title);

    const note = new this.model({
      userId: user._id,
      topic,
      title,
      expireTime: this.getExpireTime(),
    });
    await note.save();

    return note._id;
  }

  async update(id: mongoose.Types.ObjectId, topic: string, title: string) {
    this.validateTopic(topic);
    this.validateTitle(title);

    const note = await this.model.findById(id);
    if (!note) throw new NotFoundException(`Note not found with ${id}`);

    await note.updateOne({ topic, title });
  }

  async getNote(id: mongoose.Types.ObjectId): Promise<NoteDocument | null> {
    return this.getValidNotes().findOne({ _id: id });
  }

  async getNotes<T>(filter?: FilterQuery<T>, sorting?: string): Promise<NoteDocument[]> {
    return this.getValidNotes().find(filter).sort(sorting);
  }

  async paginateNotes<T>(
    filter: FilterQuery<T>,
    page: number,
    limit: number,
    sorting?: string,
  ): Promise<mongoose.PaginateResult<NoteDocument>> {
    const query = { expireTime: { $gt: moment.utc().toDate() }, ...filter };
    const options = { page, limit, sort: sorting };
    return this.model.paginate(query, options);
  }

  async remove(id: mongoose.Types.ObjectId) {
    const note = await this.model.findById(id);
    if (!note) throw new NotFoundException(`Note not found with ${id}`);

    await note.remove();
  }

  async removeExpiredNotes(date = moment.utc().toDate()) {
    const notes = await this.model.find({ expireTime: { $lte: date } });
    if (notes.length) {
      await Promise.all(notes.map((note) => note.remove()));
    }

    return notes.length;
  }

  async count<T>(filter: FilterQuery<T>): Promise<number> {
    return this.getValidNotes().countDocuments(filter).lean();
  }

  private getValidNotes() {
    return this.model.find({ expireTime: { $gt: moment.utc().toDate() } });
  }

  private getExpireTime(): Date {
    return moment.utc().add(this.ttl, 's').toDate();
  }

  private validateTopic(topic: string) {
    if (topic.length > this.topicMaxLength) {
      throw new PayloadTooLargeException(`Length of 'topic' should be lower then ${this.topicMaxLength}`);
    }
  }

  private validateTitle(title: string) {
    if (title.length > this.titleMaxLength) {
      throw new PayloadTooLargeException(`Length of 'title' should be lower then ${this.titleMaxLength}`);
    }
  }
}
