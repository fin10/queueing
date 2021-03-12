import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty()
  @Transform((v) => mongoose.Types.ObjectId(v))
  readonly parentId!: mongoose.Types.ObjectId;

  @IsNotEmpty()
  readonly body!: string;
}
