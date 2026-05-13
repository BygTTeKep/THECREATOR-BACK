import { Module } from '@nestjs/common';
import { TelegramService } from './infrastructure/services/telegram.service';

@Module({
  imports: [],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
