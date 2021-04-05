import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './google-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  @Get('logout')
  logout(@Req() req: Request, @Query('redirect') redirect = '/', @Res() res: Response): void {
    req.logOut();
    res.redirect(redirect);
  }

  @UseGuards(LocalAuthGuard)
  @Get('local')
  loginWithLocal(@Query('redirect') redirect = '/', @Res() res: Response): void {
    res.redirect(redirect);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google')
  loginWithGoogle(@Query('redirect') redirect = '/', @Res() res: Response): void {
    res.redirect(redirect);
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  handleGoogleCallback(@Query('state') redirect = '/', @Res() res: Response): void {
    res.redirect(redirect);
  }
}
