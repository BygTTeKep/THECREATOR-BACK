import { YoukassaPaymentService } from './youkassa/payment.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentVariantsEnum } from 'src/modules/payment/domain/enums/paymentVariants.enum';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly youkassaPaymentService: YoukassaPaymentService,
  ) {}
  createPaymentFactory(type: PaymentVariantsEnum) {
    switch (type) {
      case PaymentVariantsEnum.YOUKASSA:
        return this.youkassaPaymentService;
      default:
        throw new BadRequestException('Invalid payment type');
    }
  }
}
