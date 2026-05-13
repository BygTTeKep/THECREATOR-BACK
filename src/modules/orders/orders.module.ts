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

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersEntity, OrderItemsEntity]),
    RulesModule,
    ProductsModule,
    TelegramModule,
    UsersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, CreateOrderMapper],
  exports: [OrdersService],
})
export class OrdersModule {}
