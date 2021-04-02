import { ReportType } from '@lib/sdk/action/interfaces/report-type.interface';
import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsNotEmpty } from 'class-validator';
import moment, { Duration } from 'moment';

export class ImposePenaltyDto {
  @IsNotEmpty()
  @Transform((value: string) => {
    const duration = moment.duration(value);
    if (duration.asSeconds() === 0) throw new BadRequestException(`Invalid duration format: ${value}`);
    return duration;
  })
  readonly duration!: Duration;

  @ArrayNotEmpty()
  @IsEnum(ReportType, { each: true })
  readonly reasons: ReportType[] = [];
}
