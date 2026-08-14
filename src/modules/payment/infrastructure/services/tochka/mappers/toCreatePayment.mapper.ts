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
        : 'Payment for the order';
    const redirectUrl =
      type === 'subscription'
        ? 'https://example.com/subscription'
        : 'https://example.com/order';
    const failRedirectUrl =
      type === 'subscription'
        ? 'https://example.com/subscription/fail'
        : 'https://example.com/order/fail';
    return {
      customerCode: '1234567ab', //TODO customerCode,
      amount: amount,
      purpose: purpose,
      paymentMode: [paymentMode],
      redirectUrl: redirectUrl,
      failRedirectUrl: failRedirectUrl,
      merchantId: '200000000001097',
    };
  }
}
