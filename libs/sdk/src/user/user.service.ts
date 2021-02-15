import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async createUser(id: string): Promise<User> {
    const user = new this.model({ id });
    await user.save();

    return user;
  }

  async findUser(id: string): Promise<User | null> {
    return this.model.findOne({ id }).lean();
  }
}
