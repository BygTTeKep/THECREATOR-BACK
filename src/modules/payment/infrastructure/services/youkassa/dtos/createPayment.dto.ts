import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CurrencyEnum } from 'src/modules/payment/domain/enums/currency.enum';
import { Type } from 'class-transformer';
import { YoukassaPaymentStatusesEnum } from '../enums/youkassaPaymentStatuses.enum';

export class CreatePaymentYoukassaResponseDto {
  id: string;
  status: YoukassaPaymentStatusesEnum;
  paid: boolean;
  amount: {
    value: number;
    currency: string;
  };
  confirmation: {
    type: string;
    confirmation_url: string;
  };
  created_at: string;
  description: string;
  metadata: Record<string, any>;
  recipient: {
    account_id: string;
    gateway_id: string;
  };
  refundable: boolean;
  test: boolean;
}

export class CreatePaymentYoukassaRequestDto {
  @ApiProperty({
    description: 'The amount of the payment',
    example: {
      value: '100',
      currency: CurrencyEnum.RUB,
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreatePaymentAmountDto)
  amount: CreatePaymentAmountDto;
  @ApiProperty({
    description: 'The capture of the payment',
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  capture: boolean;

  @ApiProperty({
    description: 'The confirmation of the payment',
    example: {
      type: 'redirect',
      confirmation_url: 'https://example.com/return_url',
    },
  })
  @ValidateNested()
  @Type(() => CreatePaymentConfirmationDto)
  confirmation: CreatePaymentConfirmationDto;

  @ApiProperty({
    description: 'The description of the payment',
    example: 'Payment for the order',
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePaymentAmountDto {
  @ApiProperty({
    description: 'The amount of the payment',
    example: '100',
  })
  @IsNotEmpty()
  @IsNumber()
  value: string;

  @ApiProperty({
    description: 'The currency of the payment',
    example: CurrencyEnum.RUB,
  })
  @IsNotEmpty()
  @IsEnum(CurrencyEnum)
  currency: CurrencyEnum;
}

export class CreatePaymentConfirmationDto {
  @ApiProperty({
    description: 'The type of the confirmation',
    example: 'redirect',
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: 'The confirmation url',
    example: 'https://example.com/return_url',
  })
  @IsNotEmpty()
  @IsString()
  confirmation_url: string;
}

export class CreatePaymentRawDto {
  amount: CreatePaymentAmountDto;
  description: string;
}
