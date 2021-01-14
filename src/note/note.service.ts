import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import moment from 'moment';
import { FilterQuery, Model } from 'mongoose';
import { ConfigKey, QueueingConfigService } from 'src/config/queueing-config.service';
import { RawNote, RawNoteDocument } from './schemas/raw-note.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(RawNote.name) private model: Model<RawNoteDocument>,
    private readonly config: QueueingConfigService,
  ) {}

  async createWithParentId(parentId: string): Promise<string> {
    const parent = await this.model.findById(parentId);
    if (!parent) throw new BadRequestException(`${parentId} not found.`);

    const note = new this.model({
      parent: parent._id,
      expireTime: parent.expireTime,
    });
    await note.save();

    return note._id;
  }

  async create(topic: string, title: string): Promise<string> {
    const note = new this.model({
      topic,
      title,
      expireTime: this.getExpireTime(),
    });
    await note.save();

    return note._id;
  }

  async getNote(id: string): Promise<RawNote | null> {
    return this.getValidNotes().findOne({ _id: id }).lean();
  }

  async getNotes<T>(filter: FilterQuery<T>, sorting?: string): Promise<RawNote[]> {
    return this.getValidNotes().find(filter).sort(sorting).lean();
  }

  async remove(id: string): Promise<void> {
    return this.model.deleteOne({ _id: id }).exec();
  }

  async count<T>(filter: FilterQuery<T>): Promise<number> {
    return this.getValidNotes().countDocuments(filter).lean();
  }

  private getValidNotes() {
    return this.model.find({ expireTime: { $gt: moment.utc().toDate() } });
  }

  private getExpireTime(): Date {
    const ttl = this.config.getInteger(ConfigKey.NOTE_TTL);
    return moment.utc().add(ttl, 's').toDate();
  }
}
