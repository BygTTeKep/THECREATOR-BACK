import { DataSource, In, MoreThan, Not, Repository } from 'typeorm';
import { SubscriptionsEntity } from '../../domain/entities/subscriptions.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { TiersService } from 'src/modules/tiers/infrastructure/services/tiers.service';
import { SubscriptionsStatus } from '../../domain/enums/subscriptions.enum';
import { SubscriptionPlanEntity } from '../../domain/entities/subscriptionPlan.entity';
import { CreateSubscriptionDto } from '../../presentation/dtos/createSubscription.dto';
import { GetPlansMapper } from '../mappers/getPlans.mapper';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionsEntity)
    private readonly subscriptionsRepository: Repository<SubscriptionsEntity>,
    private readonly tiersService: TiersService,
    @InjectRepository(SubscriptionPlanEntity)
    private readonly subscriptionPlansRepository: Repository<SubscriptionPlanEntity>,
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly getPlansMapper: GetPlansMapper,
  ) {}
  private readonly SUB_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
  private readonly THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

  /**
   * Get active subscription by user id and order by started_at descending
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
      where: { user_id: In(userIds), status: Not('canceled') },
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
    userId: string,
    dto: CreateSubscriptionDto,
  ): Promise<SubscriptionsEntity> {
    const existingSubscription = await this.getSubscriptionByUserId(userId);
    if (existingSubscription) {
      const timeLeft =
        existingSubscription.current_period_end.getTime() -
        new Date().getTime();

      if (timeLeft > this.THREE_DAYS_MS) {
        throw new BadRequestException(
          'Subscription can be renewed only in last 3 days',
        );
      }
    }
    const plan = await this.subscriptionPlansRepository.findOne({
      where: { id: dto.planId },
    });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    // меняем статус у всех предыдущих активных подписок на past_due
    const oldSubscriptions = await this.getNotCanceledSubscriptions([userId]);
    if (oldSubscriptions.length > 0) {
      const oldSubscriptionIds = oldSubscriptions.map(
        (subscription) => subscription.id,
      );
      await this.subscriptionsRepository.update(oldSubscriptionIds, {
        status: SubscriptionsStatus.PAST_DUE,
      });
    }
    const newSubscription = await this.subscriptionsRepository.save({
      user_id: userId,
      subscription_plan_id: dto.planId,
      started_at: new Date(),
      status: 'active',
      current_period_end: new Date(new Date().getTime() + this.SUB_DURATION_MS),
    });
    const months = (await this.getNotCanceledSubscriptions([userId])).length;
    const tier = await this.tiersService.getTierByMonths(months);

    if (tier) {
      await this.dataSource
        .createQueryBuilder()
        .update('users')
        .set({ current_tier_id: tier.id, total_months: months })
        .where('id = :userId', { userId: userId })
        .execute();
    }
    return newSubscription;
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
    const subscriptions = await this.getNotCanceledSubscriptions([userId]);
    return this.getPlansMapper.toDto(plans, subscriptions);
    // return plans.map((plan) => {
    //   return {
    //     id: plan.id,
    //     name: plan.name,
    //     description: plan.description,
    //     price: plan.price,
    //     can_buy: !subscriptions.some(
    //       (subscription) => subscription.subscription_plan_id === plan.id,
    //     ),
    //   };
    // });
  }
}
