import { Injectable } from '@nestjs/common';
import { CreatePaymentLinkDto } from '../dtos/createPaymentLink.dto';
import { PaymentMode } from '../enums/paymentMode.enum';

@Injectable()
export class TochkaCreatePaymentMapper {
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
    //TODO
    const purpose =
      type === 'subscription'
        ? 'Покупка подписки на дропы THE CREATOR'
        : 'Оплата дропа на сайте THE CREATOR';
    const redirectUrl =
      type === 'subscription'
        ? 'https://thecreatorstudio.ru/profile'
        : 'https://thecreatorstudio.ru/profile';
    const failRedirectUrl =
      type === 'subscription'
        ? 'https://thecreatorstudio.ru/profile'
        : 'https://thecreatorstudio.ru/profile';
    return {
      customerCode: customerCode,
      amount: amount,
      purpose: purpose,
      paymentMode: [paymentMode],
      redirectUrl: redirectUrl,
      failRedirectUrl: failRedirectUrl,
      // merchantId: '200000000001097', //TODO merchantId
    };
  }
}
