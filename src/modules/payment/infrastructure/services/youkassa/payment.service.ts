import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CreatePaymentYoukassaRequestDto,
  CreatePaymentYoukassaResponseDto,
} from './dtos/createPayment.dto';
import { firstValueFrom } from 'rxjs';
import { YoukassaPaymentStatusesEnum } from './enums/youkassaPaymentStatuses.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderEventsEnum } from 'src/modules/orders/infrastructure/services/orderEventsListener.service';
import { SubscriptionEventsEnum } from 'src/modules/subscriptions/infrastructure/services/subscriptionEventListener.service';
import { GetEventsFromYKResponseDto } from './dtos/getEventsFromYK.dto';

@Injectable()
export class YoukassaPaymentService {
  private readonly logger: Logger = new Logger(YoukassaPaymentService.name);
  private readonly YOUKASSA_BASE_URL: string;
  private readonly YOUKASSA_IDENPOTENT_KEY: string;
  private readonly YOUKASSA_SHOP_ID: string;
  private readonly YOUKASSA_SECRET_KEY: string;
  private readonly RETURNURL_FOR_YOUKASSA: string;
  private readonly TRUST_IPS: string[];
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    const youkassaBaseUrl = this.configService.get<string>('YOUKASSA_BASE_URL');
    const youkassaIdentopotentKey = this.configService.get<string>(
      'YOUKASSA_IDENPOTENT_KEY',
    );
    const youkassaShopId = this.configService.get<string>('YOUKASSA_SHOP_ID');
    const youkassaSecretKey = this.configService.get<string>(
      'YOUKASSA_SECRET_KEY',
    );
    const returnUrlForYoukassa = this.configService.get<string>(
      'RETURNURL_FOR_YOUKASSA',
    );
    const trustIps = this.configService.get<string>('YOUKASSA_TRUST_IPS');
    if (
      !youkassaBaseUrl ||
      !youkassaIdentopotentKey ||
      !youkassaShopId ||
      !youkassaSecretKey ||
      !returnUrlForYoukassa ||
      !trustIps
    ) {
      throw new Error('youkassa config is not set');
    }
    this.YOUKASSA_BASE_URL = youkassaBaseUrl;
    this.httpService.axiosRef.defaults.baseURL = this.YOUKASSA_BASE_URL;
    this.YOUKASSA_IDENPOTENT_KEY = youkassaIdentopotentKey;
    this.YOUKASSA_SHOP_ID = youkassaShopId;
    this.YOUKASSA_SECRET_KEY = youkassaSecretKey;
    this.RETURNURL_FOR_YOUKASSA = returnUrlForYoukassa;
    this.TRUST_IPS = trustIps.split(',');
  }

  async createPayment(
    createPaymentDto: CreatePaymentYoukassaRequestDto,
  ): Promise<CreatePaymentYoukassaResponseDto> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/payments', createPaymentDto),
      );
      const payment: CreatePaymentYoukassaResponseDto = response.data;
      if (!payment || payment.status === YoukassaPaymentStatusesEnum.CANCELED) {
        throw new BadRequestException(
          'Failed to create payment or payment was canceled',
        );
      }
      return payment;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to create payment');
    }
  }
  //TODO dto ответа
  getStatusesForSubscription(payload: GetEventsFromYKResponseDto) {
    try {
      this.eventEmitter.emit(
        SubscriptionEventsEnum.SUBSCRIPTION_CHANGED,
        payload,
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to get statuses');
    }
  }
  getStatusesForOrder(payload: GetEventsFromYKResponseDto) {
    try {
      this.eventEmitter.emit(OrderEventsEnum.ORDER_CHANGED, payload);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to get statuses');
    }
  }
}
