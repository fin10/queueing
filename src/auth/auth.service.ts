import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(id: string): Promise<string> {
    let user = await this.userService.findUser(id);
    if (!user) {
      user = await this.userService.createUser(id);
    }

    return user.id;
  }
}
