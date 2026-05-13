import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class TelegramService {
  private readonly telegramBotToken: string;
  private readonly telegramChatId: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.telegramBotToken =
      this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.telegramChatId =
      this.configService.get<string>('TELEGRAM_CHAT_ID') || '';
    if (!this.telegramBotToken || !this.telegramChatId) {
      throw new Error('Telegram bot token or chat id is not set');
    }
  }
  async sendMessage(payload: any) {
    const response = await lastValueFrom(
      this.httpService.post(
        `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`,
        {
          chat_id: this.telegramChatId,
          text: payload,
          parse_mode: 'HTML',
        },
      ),
    );
    if (response.data.ok === false) {
      throw new Error('Failed to send message to Telegram');
    }
    return response.data;
  }
}
