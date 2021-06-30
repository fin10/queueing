import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService) {}

  async validateUser(provider: string, key: string) {
    const user = await this.userService.findUser({ provider, key });
    if (user) return user;

    this.logger.verbose(`User not registered: ${provider}:${key}`);
    return this.userService.createUser(provider, key);
  }
}
