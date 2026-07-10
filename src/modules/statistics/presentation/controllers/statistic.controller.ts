import { Body, Controller, Ip, Post, Req, UseGuards } from '@nestjs/common';
import { StatisticService } from '../../infrastructure/services/statistic.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CreateStatisticReqDto,
  CreateStatisticResDto,
} from '../dtos/createStatistic.dto';
import { Request } from 'express';
import { CalculateStatisticReqDto } from '../dtos/calcualteStatistic.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AdminGuard } from 'src/core/guards/admin.guard';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statService: StatisticService) {}

  @ApiOperation({ summary: 'create statistic' })
  @ApiBody({ type: CreateStatisticReqDto })
  @Post()
  async createStatistic(
    @Body() body: CreateStatisticReqDto,
    @Req() request: Request,
    @Ip() ip: string,
  ) {
    const statistic = {
      ...body,
      ip: request.ip ?? ip,
      user_agent: request.headers['user-agent'],
      referer: request.headers.referer,
    };
    await this.statService.createStatistic(statistic);
  }

  @ApiOperation({ summary: 'calcualte statistic' })
  @ApiBody({ type: CalculateStatisticReqDto })
  @ApiResponse({ type: CreateStatisticResDto })
  @Post('calc')
  @UseGuards(AdminGuard)
  @UseGuards(AuthGuard)
  async calcStatistic(@Body() body: CalculateStatisticReqDto) {
    return this.statService.calcualteStatistic(body);
  }
}
