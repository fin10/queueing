import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsNotEmpty, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  readonly NODE_ENV!: Environment;

  @IsNumber()
  readonly PORT!: number;

  @IsNotEmpty()
  @IsString()
  readonly QUEUEING_MONGODB_URI!: string;
}

export enum ConfigKey {
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  MONGODB_URI = 'QUEUEING_MONGODB_URI',
}

@Injectable()
export class QueueingConfigService {
  private readonly logger = new Logger(QueueingConfigService.name);

  constructor(private readonly config: ConfigService) {}

  get<T>(key: ConfigKey): T {
    const value = this.config.get<T>(key);
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
