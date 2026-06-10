import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueuesNameEnum } from 'src/modules/queues/domain/enums/queues.enum';
import { NotificationsService } from './notifications.service';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  constructor(private readonly notifyService: NotificationsService) {
    super();
  }
  async process(job: Job) {
    console.log('job =', job.name);
    switch (QueuesNameEnum[job.name]) {
      case QueuesNameEnum.subscription_end_notification:
        await this.notifyService.sendEmailNotification(job.data);
        break;
      default:
        break;
    }
  }
}
