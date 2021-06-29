import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from '../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { Environment, EnvironmentVariables } from '../config/env.validation';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly isProduction: boolean;

  constructor(config: ConfigService<EnvironmentVariables>, private readonly authService: AuthService) {
    super();
    this.isProduction = config.get('NODE_ENV') === Environment.Production;
  }

  async validate(username: string): Promise<User> {
    if (this.isProduction) throw new ForbiddenException(`Not allowed in production mode.`);
    return this.authService.validateUser('local', username);
  }
}
