import { Injectable } from '@nestjs/common';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(id: string): Promise<User> {
    let user = await this.userService.findUser(id);
    if (!user) {
      user = await this.userService.createUser(id);
    }

    return user;
  }
}
