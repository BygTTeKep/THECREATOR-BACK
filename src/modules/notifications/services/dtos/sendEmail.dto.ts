import { QueuesNameEnum } from 'src/modules/queues/domain/enums/queues.enum';

export class SendEmailDto {
  email: string;
  language: string;
  messageType: QueuesNameEnum;
}
