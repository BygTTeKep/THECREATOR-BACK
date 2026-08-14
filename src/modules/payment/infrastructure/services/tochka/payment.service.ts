import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  CreatePaymentLinkDto,
  CreatePaymentLinkResponseDto,
} from './dtos/createPaymentLink.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscriptionEventsEnum } from 'src/modules/subscriptions/infrastructure/services/subscriptionEventListener.service';
import { TochkaPaymentStatus } from './enums/paymentStatus.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from 'src/modules/payment/domain/entities/payment.entity';
import { In, LessThan, Repository } from 'typeorm';
import { PaymentFor } from 'src/modules/payment/domain/enums/paymentFor.enum';
import { OrderEventsEnum } from 'src/modules/orders/infrastructure/services/orderEventsListener.service';
import { Cache } from '@nestjs/cache-manager';
import { GetCustomerListResponseDto } from './dtos/getCustomerList.dto';
import { JwtService } from '@nestjs/jwt';
import { GetPaymentStatusTochkaResponseDto } from './dtos/getPaymentStatusResponse.dto';
import fs from 'fs';

@Injectable()
export class TochkaPaymentService {
  private readonly TOCHKA_BASE_URL: string;
  private readonly TOCHKA_API_KEY: string = 'sandbox.jwt.token';
  private readonly TOCHKA_CUSTOMER_LIST_CACHE_KEY: string =
    'TOCHKA_CUSTOMER_LIST_CACHE_KEY';
  private readonly TOCHKA_WEBHOOK_PUBLIC_KEY_PEM: string = '';
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    private readonly cacheManager: Cache,
    private readonly jwtService: JwtService,
  ) {
    const tochkaBaseUrl = this.configService.get<string>('TOCHKA_BASE_URL');
    if (!tochkaBaseUrl) {
      throw new Error('TOCHKA_BASE_URL is not set');
    }
    this.TOCHKA_BASE_URL = tochkaBaseUrl;
    const tochkaApiKey = this.configService.get<string>('TOCHKA_API_KEY');
    if (!tochkaApiKey) {
      throw new Error('TOCHKA_API_KEY is not set');
    }
    this.TOCHKA_API_KEY = tochkaApiKey;
    const tochkaWebhookPublicKeyPem = this.configService.get<string>(
      'TOCHKA_WEBHOOK_PUBLIC_KEY_PEM',
    );
    if (!tochkaWebhookPublicKeyPem) {
      throw new Error('TOCHKA_WEBHOOK_PUBLIC_KEY_PEM is not set');
    }
    this.TOCHKA_WEBHOOK_PUBLIC_KEY_PEM = fs.readFileSync(
      tochkaWebhookPublicKeyPem,
      'utf8',
    );
  }

  /**
   * метод для создания ссылки на оплату
   * @param data - The data for the payment link
   * @returns - The response from the Tochka API
   */
  async createLinkToPayment(
    data: CreatePaymentLinkDto,
    paymentFor: PaymentFor,
  ): Promise<CreatePaymentLinkResponseDto> {
    const response = await firstValueFrom(
      this.httpService.post(
        `${this.TOCHKA_BASE_URL}/acquiring/v1.0/payments`,
        { Data: data },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.TOCHKA_API_KEY}`,
          },
        },
      ),
    );
    await this.paymentRepository.save({
      amount: data.amount,
      status: response.data.Data.status,
      payment_for: paymentFor,
      operation_id: response.data.Data.operationId,
    });
    return response.data;
  }

  async handlePaymentStatus(body: any) {
    const response: GetPaymentStatusTochkaResponseDto =
      await this.jwtService.verifyAsync(body, {
        publicKey: this.TOCHKA_WEBHOOK_PUBLIC_KEY_PEM,
        algorithms: ['RS256'],
      });
    const payment = await this.paymentRepository.findOne({
      where: {
        operation_id: response.operationId,
      },
    });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    payment.status = response.status;
    await this.paymentRepository.save(payment);
    if (payment.payment_for === PaymentFor.SUBSCRIPTION) {
      this.eventEmitter.emit(
        SubscriptionEventsEnum.SUBSCRIPTION_CHANGED,
        response,
      );
    } else if (payment.payment_for === PaymentFor.ORDER) {
      this.eventEmitter.emit(OrderEventsEnum.ORDER_CHANGED, {
        status: response.status,
        operationId: response.operationId,
      });
    }
  }

  async getCustomerCode(): Promise<string> {
    try {
      const cachedCustomer = await this.cacheManager.get(
        this.TOCHKA_CUSTOMER_LIST_CACHE_KEY,
      );
      if (cachedCustomer) {
        return cachedCustomer as string;
      }
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.TOCHKA_BASE_URL}/open-banking/v1.0/customers`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.TOCHKA_API_KEY}`,
            },
          },
        ),
      );
      console.log(response.data.Data.Customer);
      const data: GetCustomerListResponseDto =
        response.data as GetCustomerListResponseDto;
      const foundCustomer = data.Data.Customer.find(
        (customer) => customer.customerType === 'Personal',
      ); //TODO "Business"
      if (!foundCustomer) {
        throw new NotFoundException('Customer not found');
      }
      await this.cacheManager.set(
        this.TOCHKA_CUSTOMER_LIST_CACHE_KEY,
        foundCustomer.customerCode,
        60 * 60 * 24 * 7,
      );
      return foundCustomer.customerCode;
    } catch (err) {
      throw new InternalServerErrorException(
        'Failed to get customer list',
        err,
      );
    }
  }

  async getPaymentInfoByOperationId(
    operationId: string,
  ): Promise<GetPaymentStatusTochkaResponseDto> {
    const response = await firstValueFrom(
      this.httpService.get(
        `${this.TOCHKA_BASE_URL}/acquiring/v1.0/payments/${operationId}`,
      ),
    );
    return response.data;
  }

  async autoGetInfoLostPayment() {
    try {
      const payments = await this.paymentRepository.find({
        where: {
          status: In([
            TochkaPaymentStatus.CREATED,
            TochkaPaymentStatus.AUTHORIZED,
            TochkaPaymentStatus.WAIT_FULL_PAYMENT,
          ]),
          created_at: LessThan(new Date(Date.now() - 1000 * 60 * 60 * 24)), // 24 часа
        },
        take: 20,
      });
      for (const payment of payments) {
        // достаем инфу о платеже
        // если статус платежа апрув
        // ищем заказ или подписку по operation id
        // меняем статус платежа на approved
        // и меняем статус подписки или заказа
        const paymentInfo = await this.getPaymentInfoByOperationId(
          payment.operation_id,
        );
        if (payment.status !== paymentInfo.status) {
          if (payment.payment_for === PaymentFor.SUBSCRIPTION) {
            this.eventEmitter.emit(
              SubscriptionEventsEnum.SUBSCRIPTION_CHANGED,
              { status: paymentInfo.status, operationId: payment.operation_id },
            );
          } else if (payment.payment_for === PaymentFor.ORDER) {
            this.eventEmitter.emit(OrderEventsEnum.ORDER_CHANGED, {
              status: paymentInfo.status,
              operationId: payment.operation_id,
            });
          }
          payment.status = paymentInfo.status;
          await this.paymentRepository.save(payment);
        }
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to get lost payments',
        error,
      );
    }
  }
}
