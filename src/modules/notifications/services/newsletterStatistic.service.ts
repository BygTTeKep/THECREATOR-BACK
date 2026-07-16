import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsLetterEntity } from '../domain/entities/newsletter.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GroupByPeriodEnum } from 'src/core/enums/groupByPeriod.enum';
import {
  NewsletterStatisticFilterDto,
  NewsletterStatisticReqDto,
  NewsletterStatisticResDto,
} from './dtos/newsletterStatistic.dto';

@Injectable()
export class NewsletterStatisticService {
  constructor(
    @InjectRepository(NewsLetterEntity)
    private readonly newsLetterRepo: Repository<NewsLetterEntity>,
  ) {}
  async getNewsletterStatistic(
    dto: NewsletterStatisticReqDto,
  ): Promise<NewsletterStatisticResDto> {
    const { groupBy, filter } = dto;
    const query = this.newsLetterRepo
      .createQueryBuilder('nl')
      .select(['count(*) as cnt']);
    const count = await query.getCount();
    this.applyGroupBy(query, groupBy);
    this.applyFilter(query, filter);
    const res = await query.getRawMany();
    return {
      total: count,
      statistic: res.map((r) => ({
        total: Number(r.cnt),
        groupKey: String(r.period),
      })),
    };
  }
  private applyGroupBy(
    query: SelectQueryBuilder<NewsLetterEntity>,
    groupBy: GroupByPeriodEnum,
  ) {
    let periodExpression: string;

    switch (groupBy) {
      case GroupByPeriodEnum.day:
        periodExpression = `date_trunc('day', nl.created_at)`;
        break;

      case GroupByPeriodEnum.week:
        periodExpression = `date_trunc('week', nl.created_at)`;
        break;

      case GroupByPeriodEnum.month:
        periodExpression = `date_trunc('month', nl.created_at)`;
        break;
      default:
        periodExpression = `date_trunc('day', nl.created_at)`;
    }
    query.addSelect(periodExpression, 'period').groupBy(periodExpression);
  }
  private applyFilter(
    query: SelectQueryBuilder<NewsLetterEntity>,
    filter: NewsletterStatisticFilterDto,
  ) {
    const from = filter?.date?.starts_at
      ? new Date(filter.date.starts_at)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const to = filter?.date?.ends_at
      ? new Date(filter.date.ends_at)
      : new Date();
    query
      .where('nl.created_at >= :from', { from })
      .andWhere('nl.created_at < :to', { to });
  }
}
