import { Injectable } from '@nestjs/common';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(provider: string, key: string): Promise<User> {
    let user = await this.userService.findUser({ provider, key });
    if (!user) {
      user = await this.userService.createUser(provider, key);
    }

    return user;
  }
}
