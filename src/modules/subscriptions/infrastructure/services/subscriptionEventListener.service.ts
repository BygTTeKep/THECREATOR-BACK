import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionsEntity } from '../../domain/entities/subscriptions.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { YoukassaPaymentStatusesEnum } from 'src/modules/payment/infrastructure/services/youkassa/enums/youkassaPaymentStatuses.enum';
import { SubscriptionsStatus } from '../../domain/enums/subscriptions.enum';
import { GetEventsFromYKResponseDto } from 'src/modules/payment/infrastructure/services/youkassa/dtos/getEventsFromYK.dto';

export enum SubscriptionEventsEnum {
  SUBSCRIPTION_CREATED = 'subscription.created',
  SUBSCRIPTION_CHANGED = 'subscription.changed',
}

@Injectable()
export class SubscriptionEventListenerService {
  private readonly logger: Logger = new Logger(
    SubscriptionEventListenerService.name,
  );
  constructor(
    @InjectRepository(SubscriptionsEntity)
    private readonly subscriptionsRepository: Repository<SubscriptionsEntity>,
  ) {}
  @OnEvent(SubscriptionEventsEnum.SUBSCRIPTION_CREATED)
  handleSubscriptionCreatedEvent(payload: any) {
    this.logger.log('Subscription created event received:', payload);
  }
  @OnEvent(SubscriptionEventsEnum.SUBSCRIPTION_CHANGED)
  async handleSubscriptionChangedEvent(payload: GetEventsFromYKResponseDto) {
    try {
      const subscription = await this.subscriptionsRepository.findOne({
        where: { payment_id: payload.object.id },
      });
      if (!subscription) {
        this.logger.error('Subscription not found');
        return;
      }
      if (payload.object.status === YoukassaPaymentStatusesEnum.SUCCEEDED) {
        await this.subscriptionsRepository.update(subscription.id, {
          status: SubscriptionsStatus.ACTIVE,
        });
      } else if (
        payload.object.status === YoukassaPaymentStatusesEnum.CANCELED
      ) {
        await this.subscriptionsRepository.update(subscription.id, {
          status: SubscriptionsStatus.CANCELED,
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
