import { OAuth2Strategy, Profile } from 'passport-google-oauth';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/schemas/user.schema';
import { EnvironmentVariables } from '../config/env.validation';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(OAuth2Strategy) {
  constructor(config: ConfigService<EnvironmentVariables>, private readonly authService: AuthService) {
    super({
      clientID: config.get('QUEUEING_GOOGLE_CLIENT_ID'),
      clientSecret: config.get('QUEUEING_GOOGLE_CLIENT_SECRET'),
      callbackURL: '/api/auth/google/callback',
      scope: ['openid'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<User> {
    return this.authService.validateUser('google', profile.id);
  }
}
