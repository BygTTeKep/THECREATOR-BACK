import { Module } from '@nestjs/common';
import { NotificationsProcessor } from './services/notifications.proccessor';
import { UnisenderEmailNotificationService } from './services/unisender/unisenderEmailNotification.service';
import { NotificationsService } from './services/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsLetterEntity } from './domain/entities/newsletter.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsControllers } from './presentation/controllers/notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NewsLetterEntity]), UsersModule],
  providers: [
    NotificationsService,
    NotificationsProcessor,
    UnisenderEmailNotificationService,
  ],
  exports: [],
  controllers: [NotificationsControllers],
})
export class NotificationsModule {}
