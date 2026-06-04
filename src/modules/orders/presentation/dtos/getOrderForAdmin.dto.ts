import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusEnum } from '../../domain/enums/ordersStatus.enum';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { Type } from 'class-transformer';

export class GetOrdersFiltersDto {
  @ApiProperty({
    description: 'Status filter',
    example: OrderStatusEnum.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatusEnum)
  status?: OrderStatusEnum;
  @ApiProperty({
    description: 'Emails filter',
    example: ['test@example.com', 'test2@example.com'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  emails?: string[];
}
export class GetOrdersSortingDto {
  @ApiProperty({
    description: 'Sorting field',
    example: 'created_at',
  })
  @IsOptional()
  @IsString()
  field?: 'created_at' | 'total_amount';
  @ApiProperty({
    description: 'Sorting order',
    example: 'DESC',
  })
  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}

export class GetOrdersAdminDto {
  @ApiProperty({
    description: 'Pagination object',
    example: { page: 1, limit: 10 },
  })
  @ValidateNested()
  @Type(() => PaginationDto)
  @IsNotEmpty()
  pagination: PaginationDto;

  @ApiProperty({
    description: 'Filters object',
  })
  @ValidateNested()
  @Type(() => GetOrdersFiltersDto)
  @IsNotEmpty()
  filters: GetOrdersFiltersDto;
  @ApiProperty({
    description: 'Sorting object',
    example: { created_at: 'DESC' },
  })
  @ValidateNested()
  @Type(() => GetOrdersSortingDto)
  @IsNotEmpty()
  sorting: GetOrdersSortingDto;
}
