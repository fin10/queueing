import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {
  @IsNotEmpty()
  readonly topic: string;

  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly body: string;
}
