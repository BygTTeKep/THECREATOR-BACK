import { Module } from '@nestjs/common';
import { StatisticsController } from './presentation/controllers/statistic.controller';
import { StatisticService } from './infrastructure/services/statistic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEventsEntity } from './domain/entities/analyticsEvents.entity';
import { CalculateStatisticService } from './infrastructure/services/calculateStatistic.service';
import { SendStatisticToTgCron } from './presentation/crons/sendStatisticTg.cron';
import { UsersModule } from '../users/users.module';
import { CalcStatisticMapper } from './infrastructure/mappers/calcStatistic.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsEventsEntity]), UsersModule],
  controllers: [StatisticsController],
  providers: [
    StatisticService,
    CalculateStatisticService,
    SendStatisticToTgCron,
    CalcStatisticMapper,
  ],
})
export class StatisticsModule {}
