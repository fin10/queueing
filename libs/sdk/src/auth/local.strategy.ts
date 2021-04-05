import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { QueueingConfigService } from '../config/queueing-config.service';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: QueueingConfigService, private readonly authService: AuthService) {
    super();
  }

  async validate(username: string): Promise<User> {
    if (this.config.isProduction()) throw new ForbiddenException(`Not allowed in production mode.`);
    return this.authService.validateUser('local', username);
  }
}
