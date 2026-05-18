import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersEntity } from '../../domain/entities/orders.entity';
import { Repository } from 'typeorm';
import { YoukassaPaymentStatusesEnum } from 'src/modules/payment/infrastructure/services/youkassa/enums/youkassaPaymentStatuses.enum';
import { OrderStatusEnum } from '../../domain/enums/ordersStatus.enum';
import { GetEventsFromYKResponseDto } from 'src/modules/payment/infrastructure/services/youkassa/dtos/getEventsFromYK.dto';

export enum OrderEventsEnum {
  ORDER_CREATED = 'order.created',
  ORDER_CHANGED = 'order.changed',
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
  async handleOrderChangedEvent(payload: GetEventsFromYKResponseDto) {
    try {
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
      console.log('Order changed event received:', payload);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
