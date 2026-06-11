import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionsStatus } from 'src/modules/subscriptions/domain/enums/subscriptions.enum';
import { UserStatus } from '../../domain/enums/userStatus.enum';
import { THREE_DAYS_MS } from 'src/modules/subscriptions/domain/constants/threeDaysMs';
import { SendEmailDto } from 'src/modules/notifications/services/dtos/sendEmail.dto';
import { getCountryByPhone } from 'src/core/utils/getCountryByPhone';
import { QueuesNameEnum } from 'src/modules/queues/domain/enums/queues.enum';
import { QueuesService } from 'src/modules/queues/infrastructure/services/queue.service';

@Injectable()
export class SubscriptionExpCron {
  private readonly logger = new Logger(SubscriptionExpCron.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
    private readonly queueService: QueuesService,
  ) {}
  @Cron(CronExpression.EVERY_MINUTE, { waitForCompletion: true })
  async handleCron() {
    this.logger.debug('cron started');
    const usersLists = await this.usersRepo
      .createQueryBuilder('u')
      .select(['u.email as email', 'u.phone as phone'])
      .innerJoin('subscriptions', 'sub', 'sub.user_id = u.id')
      .where('sub.status = :subStatus', {
        subStatus: SubscriptionsStatus.ACTIVE,
      })
      .andWhere('u.status = :userStatus', { userStatus: UserStatus.ACTIVE })
      .andWhere('sub.current_period_end > :now', {
        now: new Date(),
      })
      .andWhere('sub.current_period_end <= :threeDaysFromNow', {
        threeDaysFromNow: new Date(Date.now() + THREE_DAYS_MS),
      })
      .getRawMany();
    if (!usersLists.length) {
      this.logger.debug('user with subs exp nopt found');
      return;
    }
    const data: SendEmailDto[] = usersLists.map((u) => {
      return {
        email: u.email,
        language: getCountryByPhone(u.phone)?.toLocaleLowerCase() || 'ru',
        messageType: QueuesNameEnum.subscription_end_notification,
      };
    });
    await Promise.allSettled(
      data.map((e) =>
        this.queueService.addJob(
          QueuesNameEnum.subscription_end_notification,
          e,
        ),
      ),
    );
    this.logger.debug('cron end');
  }
}
