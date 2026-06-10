import { Module } from '@nestjs/common';
import { NotificationsProcessor } from './services/notifications.proccessor';
import { UnisenderEmailNotificationService } from './services/unisender/unisenderEmailNotification.service';
import { NotificationsService } from './services/notifications.service';

@Module({
  providers: [
    NotificationsService,
    NotificationsProcessor,
    UnisenderEmailNotificationService,
  ],
  exports: [],
})
export class NotificationsModule {}
