import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'The ID of the plan',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  planId: number;
}
