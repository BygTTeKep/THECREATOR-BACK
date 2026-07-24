import { Module } from '@nestjs/common';
import { StatisticsController } from './presentation/controllers/statistic.controller';
import { StatisticService } from './infrastructure/services/statistic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsEventsEntity } from './domain/entities/analyticsEvents.entity';
import { CalculateStatisticService } from './infrastructure/services/calculateStatistic.service';
import { SendStatisticToTgCron } from './presentation/crons/sendStatisticTg.cron';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsEventsEntity])],
  controllers: [StatisticsController],
  providers: [
    StatisticService,
    CalculateStatisticService,
    SendStatisticToTgCron,
  ],
})
export class StatisticsModule {}
