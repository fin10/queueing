import { Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

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
