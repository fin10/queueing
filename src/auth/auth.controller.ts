import { Req } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  @UseGuards(GoogleAuthGuard)
  @Get('login')
  login(@Req() req: Request): unknown {
    return req.user;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  handleGoogleCallback(@Req() req: Request, @Res() res: Response): void {
    res.redirect('/');
  }
}
