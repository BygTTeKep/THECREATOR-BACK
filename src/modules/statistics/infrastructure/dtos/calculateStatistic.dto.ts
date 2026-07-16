import { DateFilterDto } from 'src/core/dtos/dateFilter.dto';
import { EventTypeStatisticEnum } from '../../domain/enums/EventType.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GroupByPeriodEnum } from 'src/core/enums/groupByPeriod.enum';

export class CalculateStatisticFilterDto {
  @ApiProperty({ type: DateFilterDto })
  date?: DateFilterDto;

  @ApiProperty({ type: [String] })
  page_urls?: string[];

  @ApiProperty({
    type: EventTypeStatisticEnum,
    enumName: 'EventTypeStatisticEnum',
    enum: EventTypeStatisticEnum,
  })
  @IsEnum(EventTypeStatisticEnum)
  @IsNotEmpty()
  event_type: EventTypeStatisticEnum;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  @IsOptional()
  onlyAuthUser?: boolean;
}

export class CalculateStatisticDto {
  @ApiProperty({ type: CalculateStatisticFilterDto })
  @ValidateNested()
  @Type(() => CalculateStatisticFilterDto)
  filter: CalculateStatisticFilterDto;

  @ApiProperty({
    type: GroupByPeriodEnum,
    enumName: 'GroupByPeriodEnum',
    enum: GroupByPeriodEnum,
  })
  @IsEnum(GroupByPeriodEnum)
  @IsNotEmpty()
  groupBy: GroupByPeriodEnum;
}
