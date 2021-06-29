import moment from 'moment';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { RawNote, RawNoteDocument } from './schemas/raw-note.schema';
import { EnvironmentVariables } from '../config/env.validation';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NoteService {
  private readonly ttl: number;

  constructor(
    @InjectModel(RawNote.name) private readonly model: mongoose.PaginateModel<RawNoteDocument>,
    config: ConfigService<EnvironmentVariables>,
  ) {
    this.ttl = config.get('QUEUEING_NOTE_TTL');
  }

  async createWithParentId(user: User, parentId: mongoose.Types.ObjectId): Promise<mongoose.Types.ObjectId> {
    const parent = await this.model.findById(parentId);
    if (!parent) throw new BadRequestException(`${parentId} not found.`);

    const note = new this.model({
      userId: user._id,
      parent: parent._id,
      expireTime: parent.expireTime,
    });
    await note.save();

    return note._id;
  }

  async create(user: User, topic: string, title: string): Promise<mongoose.Types.ObjectId> {
    const note = new this.model({
      userId: user._id,
      topic,
      title,
      expireTime: this.getExpireTime(),
    });
    await note.save();

    return note._id;
  }

  async update(id: mongoose.Types.ObjectId, topic: string, title: string): Promise<void> {
    const note = await this.model.findById(id);
    if (!note) throw new NotFoundException(`Note not found with ${id}`);

    return note.updateOne({ topic, title });
  }

  async getNote(id: mongoose.Types.ObjectId): Promise<RawNote | null> {
    return this.getValidNotes().findOne({ _id: id }).lean();
  }

  async getNotes<T>(filter: FilterQuery<T>, sorting?: string): Promise<RawNote[]> {
    return this.getValidNotes().find(filter).sort(sorting).lean();
  }

  async paginateNotes<T>(
    filter: FilterQuery<T>,
    page: number,
    limit: number,
    sorting?: string,
  ): Promise<mongoose.PaginateResult<RawNote>> {
    const query = { expireTime: { $gt: moment.utc().toDate() }, ...filter };
    const options = { page, limit, sort: sorting, lean: true };
    return this.model.paginate(query, options);
  }

  async remove(id: mongoose.Types.ObjectId): Promise<void> {
    const note = await this.model.findById(id);
    if (!note) throw new NotFoundException(`Note not found with ${id}`);
    return note.remove();
  }

  async removeChildren(parentId: mongoose.Types.ObjectId): Promise<number> {
    const children = await this.model.find({ parent: parentId });
    children.forEach((child) => child.remove());

    return children.length;
  }

  async removeExpiredNotes(): Promise<number> {
    const expiredNotes = await this.model
      .find({ expireTime: { $lte: moment.utc().toDate() } })
      .select('_id')
      .exec();

    expiredNotes.forEach((note) => note.remove());

    return expiredNotes.length;
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
}
