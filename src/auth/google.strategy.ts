import { OAuth2Strategy, Profile } from 'passport-google-oauth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';
import { ConfigKey, QueueingConfigService } from 'src/config/queueing-config.service';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy) {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(config: QueueingConfigService, private readonly authService: AuthService) {
    super({
      clientID: config.getString(ConfigKey.GOOGLE_CLIENT_ID),
      clientSecret: config.getString(ConfigKey.GOOGLE_CLIENT_SECRET),
      callbackURL: '/api/auth/google/callback',
      scope: ['openid'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<User> {
    return this.authService.validateUser(profile.id);
  }
}
