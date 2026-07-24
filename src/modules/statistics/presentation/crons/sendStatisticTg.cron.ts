import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TelegramEventsEnum } from 'src/modules/telegram/infrastructure/services/telegramEventsListener.service';
import { CalculateStatisticService } from '../../infrastructure/services/calculateStatistic.service';
import { GroupByPeriodEnum } from 'src/core/enums/groupByPeriod.enum';
import { EventTypeStatisticEnum } from '../../domain/enums/EventType.enum';
import { CreateStatisticResDto } from '../dtos/createStatistic.dto';

@Injectable()
export class SendStatisticToTgCron {
  private readonly logger = new Logger(SendStatisticToTgCron.name);
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly calcStat: CalculateStatisticService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON, { waitForCompletion: true })
  async send() {
    try {
      const now = Date.now();
      const dateTo = new Date(now);
      const dateFrom = new Date(now - 24 * 60 * 60 * 1000); // 24 часа назад

      const dateFilter = {
        starts_at: dateFrom.toISOString(),
        ends_at: dateTo.toISOString(),
      };
      const [statisticPageView, statisticPageClick] = await Promise.all([
        this.calcStat.calcualteStatistic({
          filter: {
            event_type: EventTypeStatisticEnum.page_view,
            date: dateFilter,
          },
          groupBy: GroupByPeriodEnum.day,
        }),
        this.calcStat.calcualteStatistic({
          filter: {
            event_type: EventTypeStatisticEnum.click,
            date: dateFilter,
          },
          groupBy: GroupByPeriodEnum.day,
        }),
      ]);

      const sections = [
        this.formatSection(
          EventTypeStatisticEnum.page_view.toUpperCase(),
          statisticPageView,
        ),
        this.formatSection(
          EventTypeStatisticEnum.click.toUpperCase(),
          statisticPageClick,
        ),
      ].filter(Boolean); // пропускаем пустые группы
      if (!sections.length) this.logger.warn(`нет данных для отправки`);
      const resp =
        '```\nСТАТИСТИКА ЗА 24 ЧАСА\n' +
        (sections.length ? sections.join('\n\n') : 'НЕТ ДАННЫХ') +
        '\n```';

      this.eventEmitter.emit(TelegramEventsEnum.SEND_STATISTIC, resp);
    } catch (err) {
      this.logger.error(err?.message);
    }
  }

  /**
   * Суммирует count по page_url и форматирует одну группу
   * (например все PAGE_VIEW или все CLICK)
   */
  private formatSection(title: string, raw: CreateStatisticResDto[]): string {
    if (!raw.length) return '';

    const totals = new Map<string, number>();
    for (const item of raw) {
      totals.set(
        item.page_url,
        (totals.get(item.page_url) ?? 0) + Number(item.count),
      );
    }

    const entries = [...totals.entries()];
    const maxPage = Math.max(...entries.map(([page]) => page.length));
    const maxTotalLen = Math.max(
      ...entries.map(([, total]) => String(total).length),
    );

    const lines = entries.map(
      ([page, total]) =>
        `${page.padEnd(maxPage)}->${String(total).padStart(maxTotalLen)}`,
    );

    return `[ ${title} ]\n${lines.join('\n')}`;
  }
}
