import { Injectable, Logger } from '@nestjs/common';
import { CreateStatisticDto } from '../dtos/createStatistic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AnalyticsEventsEntity } from '../../domain/entities/analyticsEvents.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/modules/users/infrastructure/services/users.service';

@Injectable()
export class StatisticService {
  private readonly logger = new Logger(StatisticService.name);
  constructor(
    @InjectRepository(AnalyticsEventsEntity)
    private readonly analyticRepo: Repository<AnalyticsEventsEntity>,
    private readonly usersService: UsersService,
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
  async getCountRegUsers(): Promise<number> {
    const count = await this.usersService.getCountRegUsers();
    return count;
  }
}
