import { Injectable, Logger } from '@nestjs/common';
import { QueuesNameEnum } from '../../domain/enums/queues.enum';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueuesService {
  private readonly logger = new Logger(QueuesService.name);
  constructor(
    @InjectQueue('notifications')
    private readonly notifications: Queue,
  ) {}
  async addJob(nameQueue: QueuesNameEnum, payload: any) {
    try {
      this.logger.debug(`add job to ${nameQueue} start`);
      await this.notifications.add(nameQueue, payload);
      this.logger.debug(`add job to ${nameQueue} end`);
    } catch (err) {
      this.logger.error(`${nameQueue} err: ${err.message}`);
    }
  }
}
