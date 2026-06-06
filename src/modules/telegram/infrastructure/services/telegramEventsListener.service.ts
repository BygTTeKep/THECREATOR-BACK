import { Injectable, Logger } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { OnEvent } from '@nestjs/event-emitter';

export enum TelegramEventsEnum {
  ORDER_CREATED = 'order.created',
}

@Injectable()
export class TelegramEventListenerService {
  private readonly logger = new Logger(TelegramEventListenerService.name);
  constructor(private readonly tgService: TelegramService) {}

  @OnEvent(TelegramEventsEnum.ORDER_CREATED)
  async sendTgInfo(payload: any) {
    try {
      await this.tgService.sendMessage(payload);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
