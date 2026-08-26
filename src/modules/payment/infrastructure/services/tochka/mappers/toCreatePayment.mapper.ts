import { Injectable } from '@nestjs/common';
import { CreatePaymentLinkDto } from '../dtos/createPaymentLink.dto';
import { PaymentMode } from '../enums/paymentMode.enum';

@Injectable()
export class TochkaCreatePaymentMapper {
  constructor() {}
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
    forNoAuthUser: boolean,
  ): CreatePaymentLinkDto {
    const purpose =
      type === 'subscription'
        ? 'Покупка подписки на дропы THE CREATOR'
        : 'Оплата дропа на сайте THE CREATOR';

    let redirectUrl = '';
    let failRedirectUrl = '';
    if (forNoAuthUser) {
      redirectUrl = 'https://thecreatorstudio.ru/noauth/payment/success';
      failRedirectUrl = 'https://thecreatorstudio.ru/noauth/payment/fail';
    } else {
      redirectUrl = 'https://thecreatorstudio.ru/profile';
      failRedirectUrl = 'https://thecreatorstudio.ru/profile';
    }
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
