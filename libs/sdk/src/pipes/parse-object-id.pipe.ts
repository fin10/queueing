import { PipeTransform, Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, mongoose.Types.ObjectId | undefined> {
  transform(value?: string): mongoose.Types.ObjectId | undefined {
    if (!value) return;
    return mongoose.Types.ObjectId(value);
  }
}
