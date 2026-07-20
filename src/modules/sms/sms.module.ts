import { Module } from '@nestjs/common';
import { SmsController } from './presentation/controllers/sms.controller';
import { SmsService } from './infrastructure/services/sms.service';
import { SigmaSmsService } from './infrastructure/services/sigmaSms.service';
import { SmsAeroService } from './infrastructure/services/smsAero.service';

@Module({
  imports: [],
  controllers: [SmsController],
  providers: [SmsService, SigmaSmsService, SmsAeroService],
  exports: [SmsService],
})
export class SmsModule {}
