import { DataSource, In, MoreThan, Repository } from 'typeorm';
import { SubscriptionsEntity } from '../../domain/entities/subscriptions.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { TiersService } from 'src/modules/tiers/infrastructure/services/tiers.service';
import { SubscriptionsStatus } from '../../domain/enums/subscriptions.enum';
import { SubscriptionPlanEntity } from '../../domain/entities/subscriptionPlan.entity';
import { CreateSubscriptionDto } from '../../presentation/dtos/createSubscription.dto';
import { GetPlansMapper } from '../mappers/getPlans.mapper';
import { PaymentsService } from 'src/modules/payment/infrastructure/services/payments.service';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { PaymentVariantsEnum } from 'src/modules/payment/domain/enums/paymentVariants.enum';
import { CurrencyEnum } from 'src/modules/payment/domain/enums/currency.enum';
import { CreatePaymentMapper } from 'src/modules/payment/infrastructure/services/youkassa/mappers/createPayment.mapper';
import { FeatureFlagService } from 'src/modules/features-flag/infrastructure/services/featureFlag.service';
import { FeatureFlagEnum } from 'src/modules/features-flag/domain/enums/ff.enum';
import { THREE_DAYS_MS } from '../../domain/constants/threeDaysMs';

@Injectable()
export class SubscriptionsService {
  private readonly logger: Logger = new Logger(SubscriptionsService.name);
  constructor(
    @InjectRepository(SubscriptionsEntity)
    private readonly subscriptionsRepository: Repository<SubscriptionsEntity>,
    private readonly tiersService: TiersService,
    @InjectRepository(SubscriptionPlanEntity)
    private readonly subscriptionPlansRepository: Repository<SubscriptionPlanEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly getPlansMapper: GetPlansMapper,
    private readonly paymentService: PaymentsService,
    private readonly createPaymentMapper: CreatePaymentMapper,
    private readonly ffService: FeatureFlagService,
  ) {}
  private readonly SUB_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

  /**
   * Get last active subscription by user id and order by started_at descending
   * @param userId - user id
   * @returns - subscription
   */
  async getSubscriptionByUserId(
    userId: string,
  ): Promise<SubscriptionsEntity | null> {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { user_id: userId, status: 'active' },
      order: { started_at: 'DESC' },
    });
    return subscription;
  }

  /**
   * Get active subscriptions by user id and order by started_at descending
   * @param userId - user id
   * @returns - subscriptions
   */
  async getSubscriptions(userIds: string[]): Promise<SubscriptionsEntity[]> {
    return this.subscriptionsRepository.find({
      where: { user_id: In(userIds), status: 'active' },
      order: { started_at: 'DESC' },
    });
  }
  async getNotCanceledSubscriptions(
    userIds: string[],
  ): Promise<SubscriptionsEntity[]> {
    return await this.subscriptionsRepository.find({
      where: {
        user_id: In(userIds),
        status: In([SubscriptionsStatus.PAST_DUE, SubscriptionsStatus.ACTIVE]),
      },
      order: { started_at: 'DESC' },
    });
  }
  /**
   * Создание новой подписки для пользователя
   * Текущая подписка устанавливается на 30 дней
   * @param userId - user id
   * @returns - new subscription
   */
  async createSubscription(
    user: UserEntity,
    dto: CreateSubscriptionDto,
  ): Promise<string | null> {
    try {
      let returnUrl: string | null = null;
      const existingSubscription = await this.getSubscriptionByUserId(user.id);

      if (existingSubscription) {
        const timeLeft =
          existingSubscription.current_period_end.getTime() -
          new Date().getTime();

        if (timeLeft > THREE_DAYS_MS) {
          throw new BadRequestException(
            'Subscription can be renewed only in last 3 days',
          );
        }
      }
      // TODO определять по переданному типу
      const paymentService = this.paymentService.createPaymentFactory(
        PaymentVariantsEnum.YOUKASSA,
      );

      const plan = await this.subscriptionPlansRepository.findOne({
        where: { id: dto.planId },
      });

      if (!plan || !plan.price) {
        throw new NotFoundException('Plan not found');
      }
      const isPaymentForSubEnabled = await this.ffService.isFeatureFlagActive(
        FeatureFlagEnum.PAYMENT_FOR_SUBSCRIPTION,
      );
      // Создаем платеж в платежной системе
      if (isPaymentForSubEnabled) {
        const payment = await paymentService.createPayment(
          this.createPaymentMapper.toYoukassaRequest({
            amount: {
              value: plan.price.toString(),
              currency: CurrencyEnum.RUB,
            },
            description: `Payment for the subscription ${plan.name}`,
          }),
        );
        returnUrl = payment.confirmation.confirmation_url;
      }
      // меняем статус у всех предыдущих активных подписок на past_due
      const oldSubscriptions = await this.getNotCanceledSubscriptions([
        user.id,
      ]);
      if (oldSubscriptions.length > 0) {
        const oldSubscriptionIds = oldSubscriptions.map(
          (subscription) => subscription.id,
        );
        await this.subscriptionsRepository.update(oldSubscriptionIds, {
          status: SubscriptionsStatus.PAST_DUE,
        });
      }
      await this.subscriptionsRepository.save({
        user_id: user.id,
        subscription_plan_id: dto.planId,
        started_at: new Date(),
        status: 'active',
        current_period_end: new Date(
          new Date().getTime() + this.SUB_DURATION_MS,
        ),
      });
      const months = (await this.getNotCanceledSubscriptions([user.id])).length;
      const tier = await this.tiersService.getTierByMonths(months);

      if (tier) {
        await this.dataSource
          .createQueryBuilder()
          .update('users')
          .set({ current_tier_id: tier.id, total_months: months })
          .where('id = :userId', { userId: user.id })
          .execute();
      }
      return returnUrl;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to create subscription');
    }
  }
  async cancelSubscription(userId: string): Promise<void> {
    const existingSubscription = await this.subscriptionsRepository.findOne({
      where: {
        user_id: userId,
        status: 'active',
        started_at: MoreThan(new Date(Date.now() - this.SUB_DURATION_MS)),
      },
    });
    if (!existingSubscription) {
      throw new NotFoundException('Subscription not found');
    }
    existingSubscription.status = 'canceled';
    await this.subscriptionsRepository.save(existingSubscription);
  }
  async getPlans(userId: string) {
    const plans = await this.subscriptionPlansRepository.find();
    const subscriptions = userId
      ? await this.getNotCanceledSubscriptions([userId])
      : [];
    return this.getPlansMapper.toDto(plans, subscriptions);
  }
}
