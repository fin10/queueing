import { PipeTransform, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, mongoose.Types.ObjectId> {
  transform(value: string): mongoose.Types.ObjectId {
    return mongoose.Types.ObjectId(value);
  }
}
