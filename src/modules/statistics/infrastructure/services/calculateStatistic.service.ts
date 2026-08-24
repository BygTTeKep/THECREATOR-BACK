import { InjectRepository } from '@nestjs/typeorm';
import { AnalyticsEventsEntity } from '../../domain/entities/analyticsEvents.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  CalculateStatisticDto,
  CalculateStatisticFilterDto,
} from '../dtos/calculateStatistic.dto';
import { CreateStatisticResDto } from '../../presentation/dtos/createStatistic.dto';
import { Injectable } from '@nestjs/common';
import { GroupByPeriodEnum } from 'src/core/enums/groupByPeriod.enum';
import { CalcStatisticMapper } from '../mappers/calcStatistic.mapper';

@Injectable()
export class CalculateStatisticService {
  constructor(
    @InjectRepository(AnalyticsEventsEntity)
    private readonly analyticRepo: Repository<AnalyticsEventsEntity>,
    private readonly calcStatisticMapper: CalcStatisticMapper,
  ) {}

  async calcualteStatistic(
    dto: CalculateStatisticDto,
  ): Promise<CreateStatisticResDto[]> {
    const { groupBy, filter } = dto;

    const query = this.analyticRepo
      .createQueryBuilder('stat')
      .select([
        'COUNT(stat.id) as cnt',
        'event_type',
        `split_part(stat.page_url, '?', 1) as page_url`,
      ]);
    this.applyFilters(query, filter);
    this.applyGroupBy(query, groupBy);

    query.orderBy('period', 'DESC');
    const result = await query.getRawMany();
    const res = this.calcStatisticMapper.toResponse(result);
    return res;
  }

  private applyFilters(
    query: SelectQueryBuilder<AnalyticsEventsEntity>,
    filter: CalculateStatisticFilterDto,
  ) {
    // По дефолту берем период за месяц
    const from = filter?.date?.starts_at
      ? new Date(filter.date.starts_at)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const to = filter?.date?.ends_at
      ? new Date(filter.date.ends_at)
      : new Date();

    query
      .where('stat.created_at >= :from', { from })
      .andWhere('stat.created_at < :to', { to })
      .andWhere('stat.event_type = :et', { et: filter.event_type });
    if (filter.page_urls?.length) {
      query.andWhere(`split_part(stat.page_url, '?', 1) IN (:...pages)`, {
        pages: filter.page_urls,
      });
    }
    if (filter.onlyAuthUser !== undefined && filter.onlyAuthUser !== null) {
      const isForAuth = filter.onlyAuthUser ? 'NOT NULL' : 'NULL';
      query.andWhere(`stat.user_id IS ${isForAuth}`);
    }
  }

  private applyGroupBy(
    query: SelectQueryBuilder<AnalyticsEventsEntity>,
    groupBy: GroupByPeriodEnum,
  ) {
    let periodExpression: string;

    switch (groupBy) {
      case GroupByPeriodEnum.day:
        periodExpression = `date_trunc('day', stat.created_at)`;
        break;

      case GroupByPeriodEnum.week:
        periodExpression = `date_trunc('week', stat.created_at)`;
        break;

      case GroupByPeriodEnum.month:
        periodExpression = `date_trunc('month', stat.created_at)`;
        break;
      default:
        periodExpression = `date_trunc('day', stat.created_at)`;
    }
    query
      .addSelect(periodExpression, 'period')
      .groupBy(periodExpression)
      .addGroupBy(`split_part(stat.page_url, '?', 1)`)
      .addGroupBy('stat.event_type');
  }
}
