import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UserAuthGuard } from 'src/user/user-auth.guard';
import { User } from './schemas/user.schema';

@Controller('user')
export class UserController {
  @UseGuards(UserAuthGuard)
  @Get('profile')
  login(@Req() req: Request): User {
    return req.user as User;
  }
}
