import mongoose from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Restriction } from './restriction';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async createUser(provider: string, key: string): Promise<User> {
    const user = new this.model({ provider, key });
    await user.save();

    return user;
  }

  async findUser(query: FilterQuery<UserDocument>): Promise<User | null> {
    return this.model.findOne(query).lean();
  }

  async updateRestriction(userId: mongoose.Types.ObjectId, restriction: Restriction): Promise<void> {
    const user = await this.model.findById(userId);
    if (!user) throw new NotFoundException(`Not found user with ${userId}`);

    await user.updateOne({ restriction });
  }
}
