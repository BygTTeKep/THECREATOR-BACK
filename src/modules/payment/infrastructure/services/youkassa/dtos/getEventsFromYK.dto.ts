import { YoukassaPaymentStatusesEnum } from '../enums/youkassaPaymentStatuses.enum';

export type EventTypeType = 'payment.waiting_for_capture';
export type CurrencyType = 'RUB';
export enum PaymentMethodType {
  BANK_CARD = 'bank_card',
}

export class GetEventsFromYKResponseDto {
  'type': string;
  'event': EventTypeType;
  'object': {
    id: string;
    status: YoukassaPaymentStatusesEnum;
    paid: boolean;
    amount: {
      value: string;
      currency: CurrencyType;
    };
    authorization_details: {
      rrn: string;
      auth_code: string;
      three_d_secure: {
        applied: boolean;
      };
    };
    created_at: string;
    description: string;
    expires_at: string;
    metadata: Record<string, any>;
    payment_method: {
      type: PaymentMethodType;
      id: string;
      saved: boolean;
      card: {
        first6: string;
        last4: string;
        expiry_month: string;
        expiry_year: string;
        card_type: string;
        issuer_country: string;
        issuer_name: string;
      };
      title: string;
    };
    refundable: boolean;
    test: boolean;
  };
}
