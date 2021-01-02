import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  readonly parentId!: string;

  @IsNotEmpty()
  readonly body!: string;
}
