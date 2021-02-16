import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetArticlesDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly page = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  readonly pageSize = 10;
}
