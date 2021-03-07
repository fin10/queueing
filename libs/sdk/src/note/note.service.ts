import moment from 'moment';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { FilterQuery } from 'mongoose';
import { ConfigKey, QueueingConfigService } from '../config/queueing-config.service';
import { User } from '../user/schemas/user.schema';
import { RawNote, RawNoteDocument } from './schemas/raw-note.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(RawNote.name) private readonly model: mongoose.PaginateModel<RawNoteDocument>,
    private readonly config: QueueingConfigService,
  ) {}

  async createWithParentId(user: User, parentId: string): Promise<string> {
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

  async create(user: User, topic: string, title: string): Promise<string> {
    const note = new this.model({
      userId: user._id,
      topic,
      title,
      expireTime: this.getExpireTime(),
    });
    await note.save();

    return note._id;
  }

  async update(id: string, topic: string, title: string): Promise<void> {
    const note = await this.model.findById(id);
    if (!note) throw new NotFoundException(`Note not found with ${id}`);

    return note.updateOne({ topic, title });
  }

  async getNote(id: string): Promise<RawNote | null> {
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

  async remove(id: string): Promise<void> {
    const note = await this.model.findById(id);
    if (!note) throw new NotFoundException(`Note not found with ${id}`);
    return note.remove();
  }

  async removeChildren(parentId: string): Promise<number> {
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
    const ttl = this.config.getInteger(ConfigKey.NOTE_TTL);
    return moment.utc().add(ttl, 's').toDate();
  }
}
