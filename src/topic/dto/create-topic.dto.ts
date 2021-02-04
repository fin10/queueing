import { IsNotEmpty } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  userId!: string;

  @IsNotEmpty()
  name!: string;
}
