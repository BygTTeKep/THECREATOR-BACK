import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsAeroService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly emailCompany: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseUrl = this.configService.get<string>('SMS_BASE_URL') ?? '';
    this.apiKey = this.configService.get<string>('SMS_API_KEY') ?? '';
    this.emailCompany =
      this.configService.get<string>('SMS_EMAIL_COMPANY') ?? '';
  }
  async sendSms(phone: string, message: string): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/sms/send`,
        {
          number: phone,
          sign: 'THE CREATOR',
          text: message,
        },
        {
          auth: {
            username: this.emailCompany,
            password: this.apiKey,
          },
        },
      ),
    );
    return response.data;
  }
  async testAuth(): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.baseUrl}/auth`,
        {},
        {
          auth: {
            username: this.emailCompany,
            password: this.apiKey,
          },
        },
      ),
    );
    if (response.data.success !== true) {
      throw new Error('Failed to authenticate');
    }
    return response.data;
  }
}
