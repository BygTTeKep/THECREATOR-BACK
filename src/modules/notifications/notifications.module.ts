import { Module } from '@nestjs/common';
import { NotificationsProcessor } from './services/notifications.proccessor';
import { UnisenderEmailNotificationService } from './services/unisender/unisenderEmailNotification.service';
import { NotificationsService } from './services/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsLetterEntity } from './domain/entities/newsletter.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsControllers } from './presentation/controllers/notification.controller';
import { NewsletterStatisticService } from './services/newsletterStatistic.service';

@Module({
  imports: [TypeOrmModule.forFeature([NewsLetterEntity]), UsersModule],
  providers: [
    NotificationsService,
    NotificationsProcessor,
    UnisenderEmailNotificationService,
    NewsletterStatisticService,
  ],
  exports: [],
  controllers: [NotificationsControllers],
})
export class NotificationsModule {}
