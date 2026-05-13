import { ApiProperty } from '@nestjs/swagger';

export class GetPlansResponseDto {
  @ApiProperty({
    description: 'The ID of the plan',
    example: 1,
  })
  id: number;
  @ApiProperty({
    description: 'The name of the plan',
    example: 'Plan 1',
  })
  name: string;
  @ApiProperty({
    description: 'The description of the plan',
    example: 'Plan 1 description',
  })
  description: string;
  @ApiProperty({
    description: 'The price of the plan',
    example: 100,
  })
  price: number;
  @ApiProperty({
    description: 'Whether the plan can be bought',
    example: true,
  })
  can_buy: boolean;
}
