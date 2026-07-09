import { DateFilterDto } from 'src/core/dtos/dateFilter.dto';
import { EventTypeStatisticEnum } from '../../domain/enums/EventType.enum';
import { CalculateStatisticGropByEnum } from '../../presentation/dtos/calcualteStatistic.dto';

export class CalculateStatisticDto {
  filter: {
    date?: DateFilterDto;
    page_urls?: string[];
    event_type: EventTypeStatisticEnum;
    onlyAuthUser?: boolean;
  };
  groupBy: CalculateStatisticGropByEnum;
}
