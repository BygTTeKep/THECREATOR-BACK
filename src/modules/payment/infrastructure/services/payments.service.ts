import { YoukassaPaymentService } from './youkassa/payment.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentVariantsEnum } from 'src/modules/payment/domain/enums/paymentVariants.enum';
import { TochkaPaymentService } from './tochka/payment.service';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly youkassaPaymentService: YoukassaPaymentService,
    private readonly tochkaPaymentService: TochkaPaymentService,
  ) {}
  createPaymentFactory<T extends YoukassaPaymentService | TochkaPaymentService>(
    type: PaymentVariantsEnum,
  ): T {
    switch (type) {
      case PaymentVariantsEnum.YOUKASSA:
        return this.youkassaPaymentService as T;
      case PaymentVariantsEnum.TOCHKA:
        return this.tochkaPaymentService as T;
      default:
        throw new BadRequestException('Invalid payment type');
    }
  }
}
