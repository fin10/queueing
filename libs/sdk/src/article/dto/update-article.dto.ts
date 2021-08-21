import { IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  readonly topic?: string;

  @IsOptional()
  readonly title?: string;

  @IsOptional()
  readonly contents?: string;
}
