import { Injectable } from '@nestjs/common';
import { SubscriptionPlanEntity } from '../../domain/entities/subscriptionPlan.entity';
import { GetPlansResponseDto } from '../../presentation/dtos/getPlans.dto';
import { SubscriptionsEntity } from '../../domain/entities/subscriptions.entity';

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
        // TODO если конец подписки будет через 3 дня и меньше
        // то can_buy в true
        can_buy: !subscriptions.some(
          (subscription) => subscription.subscription_plan_id === plan.id,
        ),
      };
    });
  }
}
