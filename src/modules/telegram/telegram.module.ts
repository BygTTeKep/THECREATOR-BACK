import { Module } from '@nestjs/common';
import { TelegramService } from './infrastructure/services/telegram.service';
import { TelegramEventListenerService } from './infrastructure/services/telegramEventsListener.service';

@Module({
  imports: [],
  providers: [TelegramService, TelegramEventListenerService],
  exports: [TelegramService],
})
export class TelegramModule {}
