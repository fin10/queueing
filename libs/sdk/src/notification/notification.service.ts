import _ from 'underscore';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { NotificationMessage } from './interfaces/notification-message.interface';
import { NotificationMessageBuilder } from './notification-message.builder';
import { NotificationDocument } from './schemas/notification.schema';
import { Locale } from '../localization/enums/locale.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private readonly model: Model<NotificationDocument>,
    private readonly messageBuilder: NotificationMessageBuilder,
  ) {}

  async find(locale: Locale, userId: mongoose.Types.ObjectId): Promise<NotificationMessage[]> {
    const notifications = await this.model.find({ userId });
    const messages = await Promise.all(
      notifications.map((notification) => this.messageBuilder.build(locale, notification)),
    );
    return _.compact(messages);
  }
}
