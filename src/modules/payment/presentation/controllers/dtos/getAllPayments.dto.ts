import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { PaymentFor } from 'src/modules/payment/domain/enums/paymentFor.enum';

export class GetAllPaymentsFiltersDto {
  @ApiProperty({
    type: PaymentFor,
    enum: PaymentFor,
    enumName: 'PaymentFor',
    description: 'Payment for',
  })
  @IsEnum(PaymentFor)
  @IsNotEmpty()
  payment_for: PaymentFor;

  @ApiProperty({
    type: String,
    description: 'Payment ID',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  payment_id?: string;
}

export class GetAllPaymentsDto {
  @ApiProperty({
    type: GetAllPaymentsFiltersDto,
    description: 'Filters',
  })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => GetAllPaymentsFiltersDto)
  filters: GetAllPaymentsFiltersDto;

  @ApiProperty({
    type: PaginationDto,
    description: 'Pagination',
  })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}

export class GetAllPaymentsResponsePaymentDto {
  @ApiProperty({
    type: String,
    description: 'Payment ID',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    type: Number,
    description: 'Amount',
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @ApiProperty({
    type: String,
    description: 'Status',
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    type: Date,
    description: 'Created at',
  })
  @IsDate()
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty({
    type: Date,
    description: 'Updated at',
  })
  @IsDate()
  @IsNotEmpty()
  updated_at: Date;
  @ApiProperty({
    type: PaymentFor,
    enumName: 'PaymentFor',
    enum: PaymentFor,
    description: 'Payment for',
  })
  @IsEnum(PaymentFor)
  @IsNotEmpty()
  payment_for: PaymentFor;
}

export class GetAllPaymentsResponseDto {
  @ApiProperty({
    type: [GetAllPaymentsResponsePaymentDto],
    description: 'Payments',
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => GetAllPaymentsResponsePaymentDto)
  payments: GetAllPaymentsResponsePaymentDto[];
  @ApiProperty({
    type: Number,
    description: 'Total',
  })
  @IsNotEmpty()
  @IsNumber()
  total: number;
}
