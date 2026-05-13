import { Module } from '@nestjs/common';
import { SmsController } from './presentation/controllers/sms.controller';
import { SmsService } from './infrastructure/services/sms.service';

@Module({
  imports: [],
  controllers: [SmsController],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
