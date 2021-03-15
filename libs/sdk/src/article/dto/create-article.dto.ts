import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import mongoose from 'mongoose';

export class CreateArticleDto {
  @IsOptional()
  @Transform((v) => (v ? mongoose.Types.ObjectId(v) : undefined))
  readonly id?: mongoose.Types.ObjectId;

  @IsNotEmpty()
  readonly topic!: string;

  @IsNotEmpty()
  readonly title!: string;

  @IsNotEmpty()
  readonly body!: string;
}
