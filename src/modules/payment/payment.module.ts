import { Module } from '@nestjs/common';
import { YoukassaPaymentService } from './infrastructure/services/youkassa/payment.service';
import { CreatePaymentMapper } from './infrastructure/services/youkassa/mappers/createPayment.mapper';
import { PaymentsService } from './infrastructure/services/payments.service';
import { TochkaCreatePaymentMapper } from './infrastructure/services/tochka/mappers/toCreatePayment.mapper';
import { TochkaPaymentService } from './infrastructure/services/tochka/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './domain/entities/payment.entity';
import { TochkaController } from './infrastructure/services/tochka/controllers/tochka.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
  providers: [
    YoukassaPaymentService,
    CreatePaymentMapper,
    PaymentsService,
    TochkaCreatePaymentMapper,
    TochkaPaymentService,
  ],
  exports: [
    PaymentsService,
    CreatePaymentMapper,
    TochkaCreatePaymentMapper,
    YoukassaPaymentService,
    TochkaPaymentService,
  ],
  controllers: [TochkaController],
})
export class PaymentModule {}
