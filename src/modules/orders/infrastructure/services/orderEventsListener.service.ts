import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from '../../domain/entities/orders.entity';
import { Repository } from 'typeorm';
import { YoukassaPaymentStatusesEnum } from 'src/modules/payment/infrastructure/services/youkassa/enums/youkassaPaymentStatuses.enum';
import { OrderStatusEnum } from '../../domain/enums/ordersStatus.enum';
import { GetEventsFromYKResponseDto } from 'src/modules/payment/infrastructure/services/youkassa/dtos/getEventsFromYK.dto';
import { GetPaymentStatusTochkaResponseDto } from 'src/modules/payment/infrastructure/services/tochka/dtos/getPaymentStatusResponse.dto';
import { TochkaPaymentStatus } from 'src/modules/payment/infrastructure/services/tochka/enums/paymentStatus.enum';
import { GetStatusWebhookResponseDto } from 'src/modules/delivery/infrastructure/services/sdek/dtos/getStatusWebhook.dto';

export enum OrderEventsEnum {
  ORDER_CREATED = 'order.created',
  ORDER_CHANGED = 'order.changed',
}

function isYoukassaPayload(
  payload: unknown,
): payload is GetEventsFromYKResponseDto {
  return (
    !!payload &&
    typeof payload === 'object' &&
    'object' in payload &&
    'event' in payload
  );
}

function isTochkaPayload(
  payload: unknown,
): payload is GetPaymentStatusTochkaResponseDto {
  return (
    !!payload &&
    typeof payload === 'object' &&
    'operationId' in payload &&
    'status' in payload
  );
}

function isSdekPayload(
  payload: unknown,
): payload is GetStatusWebhookResponseDto {
  return (
    !!payload &&
    typeof payload === 'object' &&
    'code' in payload &&
    'attributes' in payload
  );
}

@Injectable()
export class OrderEventsListenerService {
  private readonly logger: Logger = new Logger(OrderEventsListenerService.name);
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
  ) {}
  @OnEvent(OrderEventsEnum.ORDER_CREATED)
  handleOrderCreatedEvent(payload: any) {
    console.log('Order created event received:', payload);
  }
  @OnEvent(OrderEventsEnum.ORDER_CHANGED)
  async handleOrderChangedEvent(
    payload:
      | GetEventsFromYKResponseDto
      | GetPaymentStatusTochkaResponseDto
      | GetStatusWebhookResponseDto,
  ) {
    try {
      if (isYoukassaPayload(payload)) {
        const order = await this.ordersRepository.findOne({
          where: { payment_id: payload.object.id },
        });
        if (!order) {
          this.logger.error('Order not found');
          return;
        }
        if (payload.object.status === YoukassaPaymentStatusesEnum.SUCCEEDED) {
          await this.ordersRepository.update(order.id, {
            status: OrderStatusEnum.PAID,
          });
        } else if (
          payload.object.status === YoukassaPaymentStatusesEnum.CANCELED
        ) {
          await this.ordersRepository.update(order.id, {
            status: OrderStatusEnum.CANCELLED,
          });
        }
      } else if (isTochkaPayload(payload)) {
        const order = await this.ordersRepository.findOne({
          where: { payment_id: payload.operationId },
        });
        if (!order) {
          this.logger.error('Order not found');
          return;
        }
        if (payload.status === TochkaPaymentStatus.APPROVED) {
          await this.ordersRepository.update(order.id, {
            status: OrderStatusEnum.PAID,
          });
        } else if (payload.status === TochkaPaymentStatus.EXPIRED) {
          await this.ordersRepository.update(order.id, {
            status: OrderStatusEnum.CANCELLED,
          });
        }
      } else if (isSdekPayload(payload)) {
        const order = await this.ordersRepository.findOne({
          where: { id_in_courier_service: payload.uuid },
        });
        //TODO: Implement
        if (!order) {
          this.logger.error('Order not found');
          return;
        }
        if (payload.attributes.code === 'RECEIVED_AT_SHIPMENT_WAREHOUSE') {
        }
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
