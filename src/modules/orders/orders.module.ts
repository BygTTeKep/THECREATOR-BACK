import { Module } from '@nestjs/common';
import { OrdersService } from './infrastructure/services/orders.service';
import { OrdersController } from './presentation/controllers/orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from './domain/entities/orders.entity';
import { OrderItemsEntity } from './domain/entities/orderItems.entity';
import { CreateOrderMapper } from './infrastructure/mappers/createOrder.mapper';
import { RulesModule } from '../rules/rules.module';
import { ProductsModule } from '../products/products.module';
import { TelegramModule } from '../telegram/telegram.module';
import { UsersModule } from '../users/users.module';
import { FeatureFlagModule } from '../features-flag/featureFlag.module';
import { PaymentModule } from '../payment/payment.module';
import { ProductVariantsEntity } from '../products/domain/entities/productVariants.entity';
import { OrderEventsListenerService } from './infrastructure/services/orderEventsListener.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrdersEntity,
      OrderItemsEntity,
      ProductVariantsEntity,
    ]),
    RulesModule,
    ProductsModule,
    TelegramModule,
    UsersModule,
    FeatureFlagModule,
    PaymentModule,
  ],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    CreateOrderMapper,
    OrderEventsListenerService,
    OrderEventsListenerService,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
