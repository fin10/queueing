import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty()
  @Transform(({ value }) => mongoose.Types.ObjectId(value))
  readonly articleId!: mongoose.Types.ObjectId;

  @IsNotEmpty()
  readonly body!: string;
}
