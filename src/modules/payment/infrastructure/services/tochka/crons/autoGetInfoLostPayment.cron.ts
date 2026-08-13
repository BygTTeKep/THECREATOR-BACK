import { Cron, CronExpression } from '@nestjs/schedule';
import { TochkaPaymentService } from '../payment.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AutoGetInfoLostPaymentCron {
  private readonly logger = new Logger(AutoGetInfoLostPaymentCron.name);
  constructor(private readonly tochkaPaymentService: TochkaPaymentService) {}

  @Cron(CronExpression.EVERY_2_HOURS, { waitForCompletion: true })
  async handleCron() {
    try {
      await this.tochkaPaymentService.autoGetInfoLostPayment();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
