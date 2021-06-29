import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateArticleDto {
  @IsOptional()
  @Transform(({ value }) => value && mongoose.Types.ObjectId(value))
  readonly id?: mongoose.Types.ObjectId;

  @IsNotEmpty()
  readonly topic!: string;

  @IsNotEmpty()
  readonly title!: string;

  @IsNotEmpty()
  readonly body!: string;
}
