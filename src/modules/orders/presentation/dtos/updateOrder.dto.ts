import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from '../../domain/enums/ordersStatus.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Order status',
    example: OrderStatusEnum.PENDING,
  })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;

  @ApiProperty({
    description: 'Order tracking number',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  tracking_number?: string;
}
