import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment';
import { Locale } from '../localization/enums/locale.enum';
import LocalizationService from '../localization/localization.service';
import { UserService } from '../user/user.service';
import { NotificationType } from './enums/notification-type.enum';
import { NotificationMessage } from './interfaces/notification-message.interface';
import { Notification } from './schemas/notification.schema';

@Injectable()
export class NotificationMessageBuilder {
  private readonly logger = new Logger(NotificationMessageBuilder.name);

  constructor(private readonly userService: UserService, private readonly localizationService: LocalizationService) {}

  build(locale: Locale, notification: Notification): Promise<NotificationMessage | null> {
    switch (notification.type) {
      case NotificationType.Restriction:
        return this.fromRestriction(locale, notification);
    }
  }

  private async fromRestriction(locale: Locale, notification: Notification): Promise<NotificationMessage | null> {
    try {
      if (notification.type !== NotificationType.Restriction) throw new Error(`Invalid type: ${notification.type}`);

      const user = await this.userService.findUser(notification.userId);
      if (!user) throw new Error(`Not found user: ${notification.userId}`);

      const { restriction } = user;
      if (!restriction) throw new Error(`No restriction in user`);
      if (moment().isAfter(restriction.period)) throw new Error(`Expired restriction: ${restriction.period}`);

      return {
        message: this.localizationService.message(locale).restriction(restriction),
        isViewed: notification.isViewed,
        createdAt: notification.createdAt,
      };
    } catch (err) {
      this.logger.error(err.message, err.stack);
      return null;
    }
  }
}
