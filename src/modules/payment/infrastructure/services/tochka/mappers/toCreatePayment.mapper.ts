import { Injectable } from '@nestjs/common';
import { CreatePaymentLinkDto } from '../dtos/createPaymentLink.dto';
import { PaymentMode } from '../enums/paymentMode.enum';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TochkaCreatePaymentMapper {
  constructor(private readonly configService: ConfigService) {}
  /**
   *
   * @param amount - amount of payment
   * @param type
   * @param paymentMode
   * @param customerCode
   * @returns
   */
  toTochkaRequest(
    amount: number,
    type: 'subscription' | 'order',
    paymentMode: PaymentMode,
    customerCode: string,
  ): CreatePaymentLinkDto {
    const environment = this.configService.get<string>('NODE_ENV');
    const purpose =
      type === 'subscription'
        ? 'Покупка подписки на дропы THE CREATOR'
        : 'Оплата дропа на сайте THE CREATOR';
    const redirectUrl =
      (type === 'subscription' || type === 'order') &&
      environment === 'production'
        ? 'https://thecreatorstudio.ru/profile'
        : 'http://localhost:3000/profile';
    const failRedirectUrl =
      (type === 'subscription' || type === 'order') &&
      environment === 'production'
        ? 'https://thecreatorstudio.ru/profile'
        : 'http://localhost:3000/profile';
    return {
      customerCode: customerCode,
      amount: amount,
      purpose: purpose,
      paymentMode: [paymentMode],
      redirectUrl: redirectUrl,
      failRedirectUrl: failRedirectUrl,
    };
  }
}
