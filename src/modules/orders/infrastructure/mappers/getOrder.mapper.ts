import { Injectable } from '@nestjs/common';
import { OrdersEntity } from '../../domain/entities/orders.entity';
import { GetOrdersResponseDto } from '../../presentation/dtos/getOrders.dto';
import { OrderStatusTranslations } from '../../domain/enums/ordersStatus.enum';

@Injectable()
export class GetOrderMapper {
  toDto(order: OrdersEntity): GetOrdersResponseDto {
    return {
      ...order,
      address: (order?.address as any) || {},
      status: OrderStatusTranslations[order.status],
      planned_delivery_date: order.planned_delivery_date
        ? new Date(order.planned_delivery_date)
        : null,
      tracking_number: order.tracking_number,
    };
  }
}
