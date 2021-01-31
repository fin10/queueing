import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawUser, RawUserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(RawUser.name) private model: Model<RawUserDocument>) {}

  async createUser(id: string): Promise<RawUser> {
    const user = new this.model({ id });
    await user.save();

    return user;
  }

  async findUser(id: string): Promise<RawUser | null> {
    return this.model.findOne({ id }).lean();
  }
}
