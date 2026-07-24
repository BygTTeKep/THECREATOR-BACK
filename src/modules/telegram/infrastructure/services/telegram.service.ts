import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { TelegramEventsEnum } from './telegramEventsListener.service';

@Injectable()
export class TelegramService {
  private readonly telegramBotToken: string;
  private readonly telegramChatId: string;
  private readonly telegramStatChatId: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.telegramBotToken =
      this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.telegramChatId =
      this.configService.get<string>('TELEGRAM_CHAT_ID') || '';
    this.telegramStatChatId =
      this.configService.get<string>('TELEGRAM_STAT_CHAT_ID') || '';
    if (
      !this.telegramBotToken ||
      !this.telegramChatId ||
      !this.telegramStatChatId
    ) {
      throw new Error('Telegram bot token or chat id is not set');
    }
  }
  async sendMessage(
    payload: any,
    parse_mode = 'HTML',
    type: TelegramEventsEnum,
  ) {
    const chatId =
      type === TelegramEventsEnum.ORDER_CREATED
        ? this.telegramChatId
        : TelegramEventsEnum.SEND_STATISTIC
          ? this.telegramStatChatId
          : '';
    if (!chatId) return;
    const response = await lastValueFrom(
      this.httpService.post(
        `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`,
        {
          chat_id: chatId,
          text: payload,
          parse_mode,
        },
      ),
    );
    if (response.data.ok === false) {
      throw new Error('Failed to send message to Telegram');
    }
    return response.data;
  }
}
