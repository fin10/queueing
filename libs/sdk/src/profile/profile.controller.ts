import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user/schemas/user.schema';
import { UserAuthGuard } from '../user/user-auth.guard';
import { Profile, ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(UserAuthGuard)
  @Get('/')
  login(@Req() req: Request): Profile {
    const user = req.user as User;
    return this.profileService.getProfile(user._id);
  }
}
