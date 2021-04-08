import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../user/schemas/user.schema';
import { UserAuthGuard } from '../user/user-auth.guard';
import { NotificationMessage } from './interfaces/notification-message.interface';
import { NotificationService } from './notification.service';

@UseGuards(UserAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotifications(@Req() req: Request): Promise<NotificationMessage[]> {
    const user = req.user as User;
    return this.notificationService.find(user._id);
  }
}
