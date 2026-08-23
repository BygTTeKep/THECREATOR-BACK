import { Injectable } from '@nestjs/common';
import { CalcStatisticOrmDto } from '../dtos/calculateStatistic.dto';
import { CreateStatisticResDto } from '../../presentation/dtos/createStatistic.dto';

@Injectable()
export class CalcStatisticMapper {
  toResponse(dto: CalcStatisticOrmDto[]): CreateStatisticResDto[] {
    return dto.map((r) => ({
      count: Number(r.cnt),
      event_type: r.event_type,
      page_url: r.page_url.split('?')[0],
      period: r.period,
    }));
  }
}
