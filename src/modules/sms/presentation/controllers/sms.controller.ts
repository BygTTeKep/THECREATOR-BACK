import { Controller } from '@nestjs/common';
import { SmsService } from 'src/modules/sms/infrastructure/services/sms.service';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}
}
