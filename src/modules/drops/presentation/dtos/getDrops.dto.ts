import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { DateFilterDto } from 'src/core/dtos/dateFilter.dto';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { GetDropFileResponseDto } from './getDropById.dto';
import { DropLineEnum } from '../../domain/enums/dropLine.enum';
import { DropsTypeEnum } from '../../domain/enums/dropType.enum';
export class GetDropsFiltersDto {
  @ApiProperty({ description: 'Is active filter', example: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({
    description: 'Date filter',
    example: { starts_at: '2026-01-01', ends_at: '2026-01-01' },
  })
  @IsOptional()
  date?: DateFilterDto;

  @ApiProperty({ description: 'Tier filter', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3)
  tier?: number;

  @ApiProperty({
    type: DropsTypeEnum,
    enumName: 'DropsTypeEnum',
    enum: DropsTypeEnum,
    example: DropsTypeEnum.preorder,
  })
  drop_type: DropsTypeEnum;

  @ApiProperty({
    type: DropLineEnum,
    enumName: 'DropLineEnum',
    enum: DropLineEnum,
    example: DropLineEnum.limit,
  })
  drop_line: DropLineEnum;
}
export class GetDropsDto {
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
    example: {
      is_active: true,
      date: { starts_at: '2026-01-01', ends_at: '2026-01-01' },
      tier: 1,
    },
  })
  @ValidateNested()
  @Type(() => GetDropsFiltersDto)
  @IsNotEmpty()
  filters: GetDropsFiltersDto;
}

export class GetDropsResponseDto {
  @ApiProperty({ description: 'Drop id', example: 1 })
  id: number;
  @ApiProperty({ description: 'Drop name', example: 'Drop 1' })
  name: string;
  @ApiProperty({
    description: 'Drop description',
    example: 'Drop 1 description',
  })
  description: string;
  @ApiProperty({ description: 'Drop starts at', example: '2026-01-01' })
  starts_at: Date;
  @ApiProperty({ description: 'Drop ends at', example: '2026-01-01' })
  ends_at: Date;
  @ApiProperty({ description: 'Drop is active', example: true })
  is_active: boolean;
  @ApiProperty({ description: 'Drop tier', example: 1 })
  tier: number;
  @ApiProperty({
    description: 'Drop files',
    example: [{ id: 1, file_url: 'https://example.com/file.jpg' }],
  })
  files: GetDropFileResponseDto[];

  @ApiProperty({
    type: DropsTypeEnum,
    enumName: 'DropsTypeEnum',
    enum: DropsTypeEnum,
    example: DropsTypeEnum.preorder,
  })
  drop_type: DropsTypeEnum;

  @ApiProperty({
    type: DropLineEnum,
    enumName: 'DropLineEnum',
    enum: DropLineEnum,
    example: DropLineEnum.limit,
  })
  drop_line: DropLineEnum;

  @ApiProperty({ description: 'Drop price', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1000000)
  price: number;
}

export class GetDropsResponseWithPageCountDto {
  @ApiProperty({ description: 'Page count', example: 10 })
  page_count: number;
  @ApiProperty({ description: 'Drops', example: [{ id: 1, name: 'Drop 1' }] })
  drops: GetDropsResponseDto[];
}
