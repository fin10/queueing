import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from 'src/user/schemas/user.schema';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  login(@Req() req: Request): User {
    return req.user as User;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  handleGoogleCallback(@Res() res: Response): void {
    res.redirect('/');
  }
}
