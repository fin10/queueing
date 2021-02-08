import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  login(@Query('redirect') redirect = '/', @Res() res: Response): void {
    res.redirect(redirect);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  handleGoogleCallback(@Query('state') redirect = '/', @Res() res: Response): void {
    res.redirect(redirect);
  }
}
