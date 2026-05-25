import { Injectable, Logger } from '@nestjs/common';
import { DropsService } from 'src/modules/drops/infrastructure/services/drops.service';
import { CronExpression } from '@nestjs/schedule';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AutoDeactivateDropCron {
  private readonly logger = new Logger(AutoDeactivateDropCron.name);
  constructor(private readonly dropsService: DropsService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    try {
      this.logger.log('Auto deactivating drops');
      await this.dropsService.autoDeactivateDrop();
      this.logger.log('Auto deactivation of drops completed');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
