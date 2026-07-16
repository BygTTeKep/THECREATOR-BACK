import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { DateFilterDto } from 'src/core/dtos/dateFilter.dto';
import { EventTypeStatisticEnum } from '../../domain/enums/EventType.enum';
import { Type } from 'class-transformer';
import { GroupByPeriodEnum } from 'src/core/enums/groupByPeriod.enum';
export class CalculateStatisticFilterDto {
  @ApiProperty({
    description: 'Date filter',
    example: { starts_at: '2026-01-01', ends_at: '2026-01-01' },
  })
  @IsOptional()
  date?: DateFilterDto;

  @ApiProperty({
    type: [String],
    description: 'page urls',
  })
  @IsArray()
  @IsOptional()
  page_urls?: string[];

  @ApiProperty({
    enum: EventTypeStatisticEnum,
    enumName: 'EventTypeStatisticEnum',
    example: EventTypeStatisticEnum.click,
  })
  @IsNotEmpty()
  @IsEnum(EventTypeStatisticEnum)
  event_type: EventTypeStatisticEnum;

  @ApiProperty({
    description: 'флаг для опеределения какой статистики',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  onlyAuthUser?: boolean;
}

export class CalculateStatisticReqDto {
  @ApiProperty({ type: CalculateStatisticFilterDto })
  @ValidateNested()
  @Type(() => CalculateStatisticFilterDto)
  @IsNotEmpty()
  filter: CalculateStatisticFilterDto;

  @ApiProperty({
    type: GroupByPeriodEnum,
    enumName: 'GroupByPeriodEnum',
    enum: GroupByPeriodEnum,
    example: GroupByPeriodEnum.day,
  })
  @IsNotEmpty()
  @IsEnum(GroupByPeriodEnum)
  groupBy: GroupByPeriodEnum;
}
