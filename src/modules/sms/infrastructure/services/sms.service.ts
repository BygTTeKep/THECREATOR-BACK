import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SmsAeroService } from './smsAero.service';
import { SigmaSmsService } from './sigmaSms.service';

@Injectable()
export class SmsService {
  private readonly cacheKey: string = 'sms_code';
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly smsAero: SmsAeroService,
    private readonly sigmaSms: SigmaSmsService,
  ) {}
  async sendSms(phone: string, message: string) {
    await this.sigmaSms.sendSms(phone, message);
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
