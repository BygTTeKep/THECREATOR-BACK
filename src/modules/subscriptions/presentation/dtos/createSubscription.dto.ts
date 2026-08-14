import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PaymentMode } from 'src/modules/payment/infrastructure/services/tochka/enums/paymentMode.enum';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'The ID of the plan',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  planId: number;

  @ApiProperty({
    description: 'The payment mode',
    example: PaymentMode.CARD,
  })
  @IsEnum(PaymentMode)
  @IsNotEmpty()
  paymentMode: PaymentMode;
}

export class CreateSubscriptionResponseDto {
  @ApiProperty({
    description: 'The URL to the payment page',
    example: 'https://example.com/payment',
  })
  @IsString()
  @IsNotEmpty()
  returnUrl: string;
}
