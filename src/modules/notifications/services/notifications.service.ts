import { Injectable, Logger } from '@nestjs/common';
import { UnisenderEmailNotificationService } from './unisender/unisenderEmailNotification.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly unisenderService: UnisenderEmailNotificationService,
  ) {}
  async sendEmailNotification(dto: any) {
    try {
      await this.unisenderService.sendEmail(dto);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
