import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateTopicDto {
  @IsNotEmpty()
  userId!: ObjectId;

  @IsNotEmpty()
  name!: string;
}
