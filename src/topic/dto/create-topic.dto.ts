import { IsNotEmpty } from 'class-validator';

export class CreateTopicDto {
  @IsNotEmpty()
  user!: string;

  @IsNotEmpty()
  name!: string;
}
