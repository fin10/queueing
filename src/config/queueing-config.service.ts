import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, Min, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  readonly NODE_ENV!: Environment;

  readonly PORT!: number;

  @IsInt()
  @Min(0)
  readonly QUEUEING_NOTE_TTL!: number;

  @IsNotEmpty()
  readonly QUEUEING_MONGODB_URI!: string;

  readonly QUEUEING_REDIS_ENABLED!: boolean;

  readonly QUEUEING_REDIS_HOST?: string;

  readonly QUEUEING_REDIS_PORT?: string;

  readonly QUEUEING_GOOGLE_CLIENT_ID?: string;

  readonly QUEUEING_GOOGLE_CLIENT_SECRET?: string;
}

export enum ConfigKey {
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  NOTE_TTL = 'QUEUEING_NOTE_TTL',
  MONGODB_URI = 'QUEUEING_MONGODB_URI',
  REDIS_ENABLED = 'QUEUEING_REDIS_ENABLED',
  REDIS_HOST = 'QUEUEING_REDIS_HOST',
  REDIS_PORT = 'QUEUEING_REDIS_PORT',
  GOOGLE_CLIENT_ID = 'QUEUEING_GOOGLE_CLIENT_ID',
  GOOGLE_CLIENT_SECRET = 'QUEUEING_GOOGLE_CLIENT_SECRET',
}

@Injectable()
export class QueueingConfigService {
  private readonly logger = new Logger(QueueingConfigService.name);

  constructor(private readonly config: ConfigService) {}

  getString(key: ConfigKey): string {
    return this.getValue(key);
  }

  getInteger(key: ConfigKey): number {
    const value = this.getValue(key);
    return Number.parseInt(value);
  }

  getBoolean(key: ConfigKey): boolean {
    const value = this.getValue(key);
    if (value === 'true') return true;
    else if (value === 'false') return false;
    else throw new InternalServerErrorException(`${key} should be boolean type.`);
  }

  private getValue(key: ConfigKey) {
    const value = this.config.get(key);
    if (!value) throw new InternalServerErrorException(`${key} is not defined.`);

    this.logger.debug(`${key}: ${value}`);

    return value;
  }
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
