import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationMessageBuilder } from './notification-message.builder';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [NotificationService, NotificationMessageBuilder],
  controllers: [NotificationController],
})
export class NotificationModule {}
