import { Injectable, Logger } from '@nestjs/common';
import { CreateStatisticDto } from '../dtos/createStatistic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyticsEventsEntity } from '../../domain/entities/analyticsEvents.entity';
import { Repository } from 'typeorm';
import { CalculateStatisticDto } from '../dtos/calculateStatistic.dto';
import { CreateStatisticResDto } from '../../presentation/dtos/createStatistic.dto';
import { CalculateStatisticGropByEnum } from '../../presentation/dtos/calcualteStatistic.dto';

@Injectable()
export class StatisticService {
  private readonly logger = new Logger(StatisticService.name);
  constructor(
    @InjectRepository(AnalyticsEventsEntity)
    private readonly analyticRepo: Repository<AnalyticsEventsEntity>,
  ) {}

  async createStatistic(dto: CreateStatisticDto) {
    try {
      await this.analyticRepo
        .createQueryBuilder()
        .insert()
        .values({
          ...dto,
        })
        .execute();
    } catch (err) {
      this.logger.error(`${err}`);
    }
  }
  async calcualteStatistic(
    dto: CalculateStatisticDto,
  ): Promise<CreateStatisticResDto[]> {
    const { groupBy, filter } = dto;
    const from = filter?.date?.starts_at
      ? new Date(filter.date.starts_at)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const to = filter?.date?.ends_at
      ? new Date(filter.date.ends_at)
      : new Date();

    const query = this.analyticRepo
      .createQueryBuilder('stat')
      .select(['COUNT(stat.id) as cnt', 'event_type', 'page_url'])
      .where('stat.created_at >= :from', { from })
      .andWhere('stat.created_at < :to', { to })
      .andWhere('stat.event_type = :et', { et: filter.event_type });
    if (filter.page_urls?.length) {
      query.andWhere('stat.page_url IN (:...pages)', {
        pages: filter.page_urls,
      });
    }
    if (filter.onlyAuthUser !== undefined && filter.onlyAuthUser !== null) {
      const isForAuth = filter.onlyAuthUser ? 'NOT NULL' : 'NULL';
      query.andWhere(`stat.user_id IS ${isForAuth}`);
    }
    let periodExpression: string;

    switch (groupBy) {
      case CalculateStatisticGropByEnum.day:
        periodExpression = `date_trunc('day', stat.created_at)`;
        break;

      case CalculateStatisticGropByEnum.week:
        periodExpression = `date_trunc('week', stat.created_at)`;
        break;

      case CalculateStatisticGropByEnum.month:
        periodExpression = `date_trunc('month', stat.created_at)`;
        break;
      default:
        periodExpression = `date_trunc('day', stat.created_at)`;
    }
    query
      .addSelect(periodExpression, 'period')
      .groupBy(periodExpression)
      .addGroupBy('stat.page_url')
      .addGroupBy('stat.event_type');
    query.orderBy('period', 'DESC');
    const result = await query.getRawMany();
    return result.map((r) => ({
      count: r.cnt,
      event_type: r.event_type,
      page_url: r.page_url,
      period: r.period,
    }));
  }
}
