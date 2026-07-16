import { Body, Controller, Post } from '@nestjs/common';
import { AddToNewsletterDto } from '../../services/dtos/addToNewsletter.dto';
import { NotificationsService } from '../../services/notifications.service';
import { CheckEnableNewsletterDto } from '../../services/dtos/checkEnableNewsletter.dto';
import { UpdateNewsletterDto } from '../../services/dtos/updateNewsletter.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  NewsletterStatisticReqDto,
  NewsletterStatisticResDto,
} from '../../services/dtos/newsletterStatistic.dto';
import { NewsletterStatisticService } from '../../services/newsletterStatistic.service';

@Controller('notifications')
export class NotificationsControllers {
  constructor(
    private readonly notifyService: NotificationsService,
    private readonly newsletterStatService: NewsletterStatisticService,
  ) {}
  @ApiOperation({ description: 'добавления пользователя в базу для рассылки' })
  @ApiBody({ type: AddToNewsletterDto })
  @Post('addToNewsletter')
  async addToNewsletter(@Body() body: AddToNewsletterDto) {
    await this.notifyService.addToNewsletter(body);
  }

  @ApiOperation({ description: 'проверка что пользователь уже в базе' })
  @ApiBody({ type: CheckEnableNewsletterDto })
  @Post('checkNewsLetter')
  async checkEnableNewsLetter(@Body() body: CheckEnableNewsletterDto) {
    return this.notifyService.isEnableNewsletter(body);
  }

  @ApiOperation({ description: 'обновления или создание рассылки' })
  @ApiBody({ type: UpdateNewsletterDto })
  @Post('updateNewsletter')
  async updateNewsLetter(@Body() body: UpdateNewsletterDto) {
    await this.notifyService.updateNewsLetter(body);
  }

  @ApiOperation({ description: 'статистика по рассылке' })
  @ApiBody({ type: NewsletterStatisticReqDto })
  @ApiResponse({ type: NewsletterStatisticResDto })
  @Post('newsletter/statistic')
  async getNewsletterStatistic(@Body() body: NewsletterStatisticReqDto) {
    return this.newsletterStatService.getNewsletterStatistic(body);
  }
}
