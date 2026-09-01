import { YoukassaPaymentService } from './youkassa/payment.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PaymentVariantsEnum } from 'src/modules/payment/domain/enums/paymentVariants.enum';
import { TochkaPaymentService } from './tochka/payment.service';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetAllPaymentsDto,
  GetAllPaymentsResponseDto,
} from '../../presentation/controllers/dtos/getAllPayments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly youkassaPaymentService: YoukassaPaymentService,
    private readonly tochkaPaymentService: TochkaPaymentService,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
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

  async getAllPayments(
    dto: GetAllPaymentsDto,
  ): Promise<GetAllPaymentsResponseDto> {
    const { filters, pagination } = dto;
    const query = this.paymentRepository.createQueryBuilder('payment');
    if (filters.payment_for) {
      query.where('payment.payment_for = :payment_for', {
        payment_for: filters.payment_for,
      });
    }
    query.select([
      'payment.id as id',
      'payment.amount as amount',
      'payment.status as status',
      'payment.payment_for as payment_for',
      'payment.operation_id as operation_id',
      'payment.created_at as created_at',
      'payment.updated_at as updated_at',
    ]);
    const total = await query.getCount();
    query.orderBy('payment.created_at', 'DESC');
    query.offset((pagination.page - 1) * pagination.limit);
    query.limit(pagination.limit);
    const payments = await query.getRawMany();
    return {
      payments,
      total: Math.ceil(Number(total) / pagination.limit),
    };
  }
}
