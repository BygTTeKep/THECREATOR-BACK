import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EventTypeStatisticEnum } from '../../domain/enums/EventType.enum';

export class CreateStatisticReqDto {
  @ApiProperty({
    enum: EventTypeStatisticEnum,
    enumName: 'EventTypeStatisticEnum',
    example: EventTypeStatisticEnum.click,
  })
  @IsNotEmpty()
  @IsEnum(EventTypeStatisticEnum)
  event_type: EventTypeStatisticEnum;

  @ApiProperty({
    type: String,
    description: 'page link',
    example: '/socailmedia',
  })
  @IsNotEmpty()
  @IsString()
  page_url: string;

  @ApiProperty({ example: '{}', description: 'metadata' })
  @IsOptional()
  metadata?: Record<any, any>;

  @ApiProperty({
    type: String,
    example: '123-123-123',
    description: 'user session id',
  })
  @IsNotEmpty()
  @IsString()
  session_id: string;
}

export class CreateStatisticResDto {
  @ApiProperty({
    description: 'количество кликов/переходов',
    type: Number,
  })
  count: number;

  @ApiProperty({
    description: 'тип события',
    example: EventTypeStatisticEnum.click,
    type: EventTypeStatisticEnum,
    enum: EventTypeStatisticEnum,
    enumName: 'EventTypeStatisticEnum',
  })
  event_type: EventTypeStatisticEnum;

  @ApiProperty({
    description: 'целевая страница',
    type: String,
  })
  page_url: string;

  @ApiProperty({
    description: 'период',
    type: String,
  })
  period: string;
}
