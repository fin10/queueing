import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateTopicDto {
  @IsNotEmpty()
  userId!: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  name!: string;
}
