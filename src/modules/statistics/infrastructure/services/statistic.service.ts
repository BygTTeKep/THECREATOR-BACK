import { Injectable, Logger } from '@nestjs/common';
import { CreateStatisticDto } from '../dtos/createStatistic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyticsEventsEntity } from '../../domain/entities/analyticsEvents.entity';
import { Repository } from 'typeorm';

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
}
