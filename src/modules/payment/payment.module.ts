import { Module } from '@nestjs/common';
import { YoukassaPaymentService } from './infrastructure/services/youkassa/payment.service';
import { CreatePaymentMapper } from './infrastructure/services/youkassa/mappers/createPayment.mapper';
import { PaymentsService } from './infrastructure/services/payments.service';

@Module({
  imports: [],
  providers: [YoukassaPaymentService, CreatePaymentMapper, PaymentsService],
  exports: [PaymentsService, CreatePaymentMapper],
})
export class PaymentModule {}
