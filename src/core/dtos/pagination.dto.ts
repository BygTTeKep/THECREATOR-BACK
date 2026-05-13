import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class PaginationDto {
  @ApiProperty({ description: 'Page number', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  page: number;
  @ApiProperty({ description: 'Limit', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(100)
  limit: number;
}
