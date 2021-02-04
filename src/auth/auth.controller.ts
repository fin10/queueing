import { Req } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from 'src/user/schemas/user.schema';
import { UserAuthGuard } from './user-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @UseGuards(UserAuthGuard)
  @Get('google')
  login(@Req() req: Request): User {
    const user = req.user as User;
    return user;
  }

  @UseGuards(UserAuthGuard)
  @Get('google/callback')
  handleGoogleCallback(@Req() req: Request, @Res() res: Response): void {
    res.redirect('/');
  }
}
