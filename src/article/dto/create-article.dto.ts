import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @IsOptional()
  readonly id?: string;

  @IsNotEmpty()
  readonly topic!: string;

  @IsNotEmpty()
  readonly title!: string;

  @IsNotEmpty()
  readonly body!: string;
}
