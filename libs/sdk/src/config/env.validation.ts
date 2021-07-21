import { InternalServerErrorException } from '@nestjs/common';
import { plainToClass, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  readonly NODE_ENV: Environment;

  @IsNumber()
  readonly PORT: number;

  @IsNumber()
  @IsPositive()
  readonly QUEUEING_NOTE_TTL = 3600;

  @IsNumber()
  @IsPositive()
  readonly QUEUEING_NOTE_MAX_LENGTH = 2000;

  @IsNumber()
  @IsPositive()
  readonly QUEUEING_TITLE_MAX_LENGTH = 50;

  @IsNumber()
  @IsPositive()
  readonly QUEUEING_TOPIC_MAX_LENGTH = 15;

  @IsString()
  @IsNotEmpty()
  readonly QUEUEING_MONGODB_URI: string;

  @IsString()
  @IsOptional()
  readonly QUEUEING_MONGODB_USER?: string;

  @IsString()
  @IsOptional()
  readonly QUEUEING_MONGODB_PASSWORD?: string;

  @IsString()
  @IsOptional()
  readonly QUEUEING_MONGODB_AUTH_DB?: string;

  @IsBoolean()
  @Transform((params) => params.obj[params.key] === 'true')
  readonly QUEUEING_REDIS_ENABLED: boolean;

  @IsString()
  readonly QUEUEING_REDIS_HOST: string;

  @IsString()
  @IsOptional()
  readonly QUEUEING_REDIS_PORT?: string;

  @IsString()
  @IsOptional()
  readonly QUEUEING_GOOGLE_CLIENT_ID?: string;

  @IsString()
  @IsOptional()
  readonly QUEUEING_GOOGLE_CLIENT_SECRET?: string;

  @IsString()
  @IsOptional()
  readonly QUEUEING_AUTH_SECRET?: string;

  @IsBoolean()
  @Transform((params) => params.obj[params.key] === 'true')
  readonly QUEUEING_JIRA_ENABLED: boolean;

  @IsString()
  @IsOptional()
  readonly QUEUEING_JIRA_URL?: string;

  @IsString()
  @IsOptional()
  readonly QUEUEING_JIRA_USERNAME?: string;

  @IsString()
  @IsOptional()
  readonly QUEUEING_JIRA_TOKEN?: string;
}

export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new InternalServerErrorException(errors.toString());
  }

  return validatedConfig;
}
