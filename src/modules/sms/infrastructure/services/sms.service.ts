import { ConfigService } from '@nestjs/config';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class SmsService {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly emailCompany: string;
  private readonly cacheKey: string = 'sms_code';
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.baseUrl = this.configService.get<string>('SMS_BASE_URL') ?? '';
    this.apiKey = this.configService.get<string>('SMS_API_KEY') ?? '';
    this.emailCompany =
      this.configService.get<string>('SMS_EMAIL_COMPANY') ?? '';
  }
  async sendSms(phone: string, message: string) {
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
  async testAuth() {
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
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }
  async sendCode(phone: string) {
    const code = this.generateCode();
    console.log(code);
    // TODO пока вырубил отправку смс
    // await this.sendSms(phone, `Your verification code is ${code}`);
    await this.cacheManager.set(
      `${this.cacheKey}:${phone}`,
      code,
      60 * 5 * 1000,
    );
    return code;
  }
  async verifyCode(phone: string, code: string) {
    const cachedCode = await this.cacheManager.get(`${this.cacheKey}:${phone}`);
    if (cachedCode?.toString() !== code) {
      throw new BadRequestException('Invalid code');
    }
    await this.cacheManager.del(`${this.cacheKey}:${phone}`);
    return true;
  }
}
