import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateRuleForDropDto {
  @ApiProperty({ description: 'The minimum tier id' })
  @IsNumber()
  @IsNotEmpty()
  minTierId?: number;

  @ApiProperty({ description: 'The minimum months' })
  @IsNumber()
  @IsOptional()
  minMonths?: number;

  @ApiProperty({ description: 'The whitelist only' })
  @IsBoolean()
  @IsOptional()
  whitelistOnly?: boolean;
}
