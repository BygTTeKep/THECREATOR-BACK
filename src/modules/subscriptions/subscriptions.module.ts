import { Module } from '@nestjs/common';
import { SubscriptionsService } from './infrastructure/services/subscriptions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsEntity } from './domain/entities/subscriptions.entity';
import { SubscriptionsController } from './presentation/controllers/subscriptions.controller';
import { TiersModule } from '../tiers/tiers.module';
import { SubscriptionPlanEntity } from './domain/entities/subscriptionPlan.entity';
import { GetPlansMapper } from './infrastructure/mappers/getPlans.mapper';
import { PaymentModule } from '../payment/payment.module';
import { SubscriptionEventListenerService } from './infrastructure/services/subscriptionEventListener.service';
import { FeatureFlagModule } from '../features-flag/featureFlag.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([SubscriptionsEntity, SubscriptionPlanEntity]),
    TiersModule,
    PaymentModule,
    FeatureFlagModule,
  ],
  providers: [
    SubscriptionsService,
    GetPlansMapper,
    SubscriptionEventListenerService,
  ],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
