import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { DateFilterDto } from 'src/core/dtos/dateFilter.dto';
import { GroupByPeriodEnum } from 'src/core/enums/groupByPeriod.enum';

export class NewsletterStatisticFilterDto {
  @ApiProperty({ type: DateFilterDto })
  date?: DateFilterDto;
}

export class NewsletterStatisticReqDto {
  @ApiProperty({ type: NewsletterStatisticFilterDto })
  @ValidateNested()
  @Type(() => NewsletterStatisticFilterDto)
  filter: NewsletterStatisticFilterDto;

  @ApiProperty()
  groupBy: GroupByPeriodEnum; //TODO
}

export class NewsletterStatisticRowResDto {
  @ApiProperty({ type: Number })
  total: number;
  @ApiProperty({ type: String })
  groupKey: string;
}
export class NewsletterStatisticResDto {
  @ApiProperty({ type: Number })
  total: number;

  @ApiProperty({ type: [NewsletterStatisticRowResDto] })
  statistic: NewsletterStatisticRowResDto[];
}
