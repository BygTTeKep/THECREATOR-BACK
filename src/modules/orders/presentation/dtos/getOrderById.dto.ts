import { ApiProperty } from '@nestjs/swagger';
import {
  OrderStatusEnum,
  OrderStatusTranslations,
} from '../../domain/enums/ordersStatus.enum';
import { UserStatus } from 'src/modules/users/domain/enums/userStatus.enum';
import { DeliveryTypeEnum } from 'src/modules/delivery/domain/enums/deliveryType.enum';
import { OrdersTypeEnum } from '../../domain/enums/ordersType.enum';

export class UserDto {
  @ApiProperty({ description: 'user metadata' })
  metadata: Record<string, any>;

  @ApiProperty({ description: 'user total_months' })
  total_months: number;

  @ApiProperty({ description: 'user current_tier_id' })
  current_tier_id: number;

  @ApiProperty({ description: 'user email' })
  email: string;

  @ApiProperty({ description: 'user phone' })
  phone: string;

  @ApiProperty({ description: 'user status' })
  status: UserStatus;
}

export class GetOrderByIdResponseDto {
  @ApiProperty({
    description: 'Order ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;
  @ApiProperty({
    description: 'Order status',
    example: OrderStatusTranslations[OrderStatusEnum.PENDING],
  })
  status: string;
  @ApiProperty({ description: 'Order total amount', example: 100 })
  total_amount: number;
  @ApiProperty({
    description: 'Order created at',
    example: '2026-01-01T00:00:00.000Z',
  })
  created_at: Date;
  @ApiProperty({ description: 'Order drop ID', example: 1 })
  drop_id: number;

  @ApiProperty({ description: 'Order tracking number', example: '1234567890' })
  tracking_number: string;

  @ApiProperty({ description: 'user data', type: UserDto })
  user: UserDto;

  @ApiProperty({
    description: 'delivery_method',
  })
  delivery_method: string;

  @ApiProperty({
    description: 'delivery_type',
    example: DeliveryTypeEnum.pvz,
    enum: DeliveryTypeEnum,
  })
  delivery_type: string;

  @ApiProperty({
    type: OrdersTypeEnum,
    enumName: 'OrdersTypeEnum',
    enum: OrdersTypeEnum,
    example: OrdersTypeEnum.preorder,
  })
  order_type: OrdersTypeEnum;
}
