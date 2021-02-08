import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { GoogleAuthGuard } from './google-auth.guard';

@Controller('auth')
export class AuthController {
  @Get('logout')
  logout(@Req() req: Request, @Query('redirect') redirect = '/', @Res() res: Response): void {
    req.logOut();
    res.redirect(redirect);
  }

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
