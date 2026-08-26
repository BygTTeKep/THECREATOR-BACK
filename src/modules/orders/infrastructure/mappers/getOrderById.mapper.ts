import { Injectable } from '@nestjs/common';
import { GetOrderByIdResponseDto } from '../../presentation/dtos/getOrderById.dto';
import { OrderStatusTranslations } from '../../domain/enums/ordersStatus.enum';

@Injectable()
export class GetOrderByIdMapper {
  toDto(data: any): GetOrderByIdResponseDto {
    return {
      id: data.id,
      metadata: data.metadata,
      drop_id: data.drop_id,
      tracking_number: data.tracking_number,
      total_amount: data.total_amount,
      status: OrderStatusTranslations[data.order_status] || 'unknown',
      created_at: data.created_at,
      delivery_method: data.delivery_method,
      delivery_type: data.delivery_type,
      order_type: data.order_type,
      user: {
        email: data.email,
        phone: data.phone,
        metadata: data.metadata,
        current_tier_id: data.current_tier_id,
        total_months: data.total_months,
        status: data.user_status,
      },
    };
  }
}
