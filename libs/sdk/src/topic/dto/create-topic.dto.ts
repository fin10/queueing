import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTopicDto {
  @IsNotEmpty()
  @Transform((v) => mongoose.Types.ObjectId(v))
  userId!: mongoose.Types.ObjectId;

  @IsNotEmpty()
  name!: string;
}
