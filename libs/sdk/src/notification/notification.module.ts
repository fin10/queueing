import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationMessageBuilder } from './notification-message.builder';
import { UserModule } from '../user/user.module';
import { LocalizationModule } from '../localization/localization.module';

@Module({
  imports: [UserModule, LocalizationModule],
  providers: [NotificationService, NotificationMessageBuilder],
  controllers: [NotificationController],
})
export class NotificationModule {}
