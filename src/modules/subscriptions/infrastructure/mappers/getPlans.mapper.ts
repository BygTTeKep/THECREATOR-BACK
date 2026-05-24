import { Injectable } from '@nestjs/common';
import { SubscriptionPlanEntity } from '../../domain/entities/subscriptionPlan.entity';
import { GetPlansResponseDto } from '../../presentation/dtos/getPlans.dto';
import { SubscriptionsEntity } from '../../domain/entities/subscriptions.entity';
import { THREE_DAYS_MS } from '../../domain/constants/threeDaysMs';

@Injectable()
export class GetPlansMapper {
  toDto(
    plans: SubscriptionPlanEntity[],
    subscriptions: SubscriptionsEntity[],
  ): GetPlansResponseDto[] {
    return plans.map((plan) => {
      return {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        //  если конец подписки будет через 3 дня и меньше
        // то can_buy в true
        can_buy: !subscriptions.some(
          (subscription) =>
            subscription.subscription_plan_id === plan.id &&
            subscription.status === 'active' &&
            subscription.current_period_end.getTime() - new Date().getTime() >
              THREE_DAYS_MS,
        ),
      };
    });
  }
}
