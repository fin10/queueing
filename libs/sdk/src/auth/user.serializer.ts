import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UserSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: CallableFunction): void {
    return done(null, user._id);
  }

  async deserializeUser(id: string, done: CallableFunction): Promise<void> {
    try {
      const user = await this.userService.findUser({ _id: id });
      if (!user) throw new NotFoundException(`Not found user with ${id}`);
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
}
