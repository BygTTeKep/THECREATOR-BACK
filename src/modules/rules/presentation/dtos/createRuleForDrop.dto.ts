import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRuleForDropDto {
  @ApiProperty({ description: 'The drop id' })
  @IsNumber()
  @IsNotEmpty()
  dropId: number;

  @ApiProperty({ description: 'The minimum tier id' })
  @IsNotEmpty()
  @IsNumber()
  minTierId: number;

  @ApiProperty({ description: 'The whitelist only' })
  @IsBoolean()
  @IsNotEmpty()
  whitelistOnly: boolean;
}
