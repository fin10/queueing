import { Controller, DefaultValuePipe, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Locale } from '../localization/enums/locale.enum';
import { User } from '../user/schemas/user.schema';
import { UserAuthGuard } from '../user/user-auth.guard';
import { NotificationMessage } from './interfaces/notification-message.interface';
import { NotificationService } from './notification.service';

@UseGuards(UserAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotifications(
    @Req() req: Request,
    @Query('locale', new DefaultValuePipe(Locale['ko-KR'])) locale: Locale,
  ): Promise<NotificationMessage[]> {
    const user = req.user as User;
    return this.notificationService.find(locale, user._id);
  }
}
