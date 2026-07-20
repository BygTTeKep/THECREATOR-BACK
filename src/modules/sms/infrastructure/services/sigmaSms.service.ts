import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SigmaSmsService {
  private readonly logger = new Logger(SigmaSmsService.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get<string>('SIGMA_SMS_BASE_URL') ?? '';
    this.apiKey = this.configService.get<string>('SIGMA_SMS_API_KEY') ?? '';
  }
  async sendSms(phone: string, message: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/sendings`,
          {
            recipient: phone,
            type: 'sms',
            payload: {
              //   sender: 'BYCREATOR',
              sender: 'B-Media',
              text: message,
            },
          },
          {
            headers: { Authorization: this.apiKey },
          },
        ),
      );
      return response.data;
    } catch (err) {
      this.logger.error(`${err}`);
      throw err;
    }
  }
}
