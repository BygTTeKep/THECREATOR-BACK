import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import {
  OrderStatusEnum,
  OrderStatusTranslations,
} from '../../domain/enums/ordersStatus.enum';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class GetOrdersDto {
  @ApiProperty({
    description: 'Pagination object',
    example: { page: 1, limit: 10 },
  })
  @ValidateNested()
  @Type(() => PaginationDto)
  @IsNotEmpty()
  pagination: PaginationDto;
}

export class GetOrdersResponseDto {
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
}
