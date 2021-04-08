import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { NotificationType } from './enums/notification-type.enum';
import { NotificationMessage } from './interfaces/notification-message.interface';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationMessageBuilder {
  private readonly logger = new Logger(NotificationMessageBuilder.name);

  constructor(private readonly userService: UserService) {}

  build(notification: Notification): Promise<NotificationMessage | null> {
    switch (notification.type) {
      case NotificationType.Restriction:
        return this.fromRestriction(notification);
    }
  }

  private async fromRestriction(notification: Notification): Promise<NotificationMessage | null> {
    if (notification.type !== NotificationType.Restriction) throw new BadRequestException();

    const user = await this.userService.findUser(notification.userId);
    if (!user) {
      this.logger.error(`Not found user: ${notification.userId}`);
      return null;
    }

    return {
      message: '',
      detail: '',
    };
  }
}
