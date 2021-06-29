import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTopicDto {
  @IsNotEmpty()
  @Transform(({ value }) => mongoose.Types.ObjectId(value))
  userId!: mongoose.Types.ObjectId;

  @IsNotEmpty()
  name!: string;
}
