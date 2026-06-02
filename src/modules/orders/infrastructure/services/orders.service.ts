import { OrdersEntity } from '../../domain/entities/orders.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateOrderDto } from '../../presentation/dtos/createOrder.dto';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { OrderStatusEnum } from '../../domain/enums/ordersStatus.enum';
import {
  CreateOrderItemDto,
  CreateOrderMapper,
} from '../mappers/createOrder.mapper';
import { OrderItemsEntity } from '../../domain/entities/orderItems.entity';
import { RulesService } from 'src/modules/rules/infrastructure/services/rules.service';
import { ProductsService } from 'src/modules/products/infrastructure/services/products.service';
import { TelegramService } from 'src/modules/telegram/infrastructure/services/telegram.service';
import { UsersService } from 'src/modules/users/infrastructure/services/users.service';
import { FeatureFlagService } from 'src/modules/features-flag/infrastructure/services/featureFlag.service';
import { PaymentsService } from 'src/modules/payment/infrastructure/services/payments.service';
import { FeatureFlagEnum } from 'src/modules/features-flag/domain/enums/ff.enum';
import { CreatePaymentMapper } from 'src/modules/payment/infrastructure/services/youkassa/mappers/createPayment.mapper';
import { PaymentVariantsEnum } from 'src/modules/payment/domain/enums/paymentVariants.enum';
import { CurrencyEnum } from 'src/modules/payment/domain/enums/currency.enum';
import { ProductVariantsEntity } from 'src/modules/products/domain/entities/productVariants.entity';
import {
  GetOrdersDto,
  GetOrdersResponseDto,
} from '../../presentation/dtos/getOrders.dto';
import { GetOrderMapper } from '../mappers/getOrder.mapper';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
    private readonly createOrderMapper: CreateOrderMapper,
    private readonly productsService: ProductsService,
    private readonly rulesService: RulesService,
    private readonly telegramService: TelegramService,
    private readonly usersService: UsersService,
    private readonly ffService: FeatureFlagService,
    private readonly paymentService: PaymentsService,
    private readonly createPaymentMapper: CreatePaymentMapper,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly getOrderMapper: GetOrderMapper,
  ) {}
  async createOrder(
    order: CreateOrderDto,
    user: UserEntity,
  ): Promise<string | null> {
    try {
      let returnUrl: string | null = null;

      const canBuy = await this.rulesService.canUserBuyProduct(
        user,
        order.dropId,
      );
      if (!canBuy) {
        throw new BadRequestException('You are not allowed to buy this drop');
      }
      await this.dataSource.transaction(
        'SERIALIZABLE',
        async (transactionalEntityManager) => {
          // Получаем продукты для заказа
          const products =
            await this.productsService.getProductsByDropIdAndProductIds(
              order.dropId,
              order.products.map((item) => item.product_id),
            );
          const productVariantIds = order.products.map(
            (item) => item.variant_id,
          );
          const productVariants =
            await this.productsService.getProductVariantsByIds(
              productVariantIds,
            );
          if (productVariants.length === 0) {
            throw new BadRequestException('Products not found');
          }

          // Считаем общую стоимость заказа
          const totalAmount = this.getTotalAmount(order, productVariants);

          // Создаем новый заказ
          const newOrder = await transactionalEntityManager.save(
            OrdersEntity,
            this.ordersRepository.create({
              user_id: user.id,
              status: OrderStatusEnum.PENDING,
              total_amount: totalAmount,
              created_at: new Date(),
              drop_id: order.dropId,
              delivery_method: order.deliveryMethod,
            }),
          );
          const isPaymentForOrdersEnabled =
            await this.ffService.isFeatureFlagActive(
              FeatureFlagEnum.PAYMENT_FOR_ORDERS,
            );
          if (isPaymentForOrdersEnabled) {
            // Создаем платеж в платежной системе
            const payment = await this.paymentService
              .createPaymentFactory(PaymentVariantsEnum.YOUKASSA)
              .createPayment(
                this.createPaymentMapper.toYoukassaRequest({
                  amount: {
                    value: totalAmount.toString(),
                    currency: CurrencyEnum.RUB,
                  },
                  description: `Payment for the order ${newOrder.id}`,
                }),
              );
            returnUrl = payment.confirmation.confirmation_url;
          }
          // Создаем новые заказы для продуктов
          const orderItems: CreateOrderItemDto[] = this.createOrderMapper.toDto(
            order,
            newOrder.id,
            products,
            productVariants,
          );
          await transactionalEntityManager.save(OrderItemsEntity, orderItems);
          // await transactionalEntityManager.save(OrdersEntity, newOrder);
          await this.telegramService.sendMessage(`
            <b>New order created:</b>
            <b>Order ID:</b> ${newOrder.id}
            <b>User ID:</b> ${user.id}
            <b>User Phone:</b> ${user.phone}
            <b>User Email:</b> ${user.email}
            <b>Products:</b> ${products.map((product) => product.name).join(', ')}, 
              <b>size:</b>${productVariants.map((variant) => variant.size).join(', ')}, 
              <b>sku:</b>${productVariants.map((variant) => variant.sku).join(', ')}
            <b>Total Amount:</b> ${totalAmount}
            <b>Created At:</b> ${newOrder.created_at.toISOString()}
          `);

          // Пересчитываем остатки продуктов
          for (const product of products) {
            const quantity = order.products.find(
              (item) => item.product_id === product.id,
            )?.quantity;
            if (!quantity) {
              continue;
            }
            await this.productsService.recalculateStock(
              transactionalEntityManager,
              productVariants.map((variant) => variant.id),
              quantity,
            );
          }
        },
      );
      await this.usersService.updateUser(user.id, {
        metadata: {
          ...user.metadata,
          fullName: order.fullName,
          shippingAddress: order.shippingAddress,
        },
      });
      return returnUrl;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getOrderItemsByProductIds(
    productIds: string[],
    userId: string,
  ): Promise<OrderItemsEntity[]> {
    const orders = await this.ordersRepository
      .createQueryBuilder('orders')
      .select('orders.id', 'order_id')
      .addSelect('order_items.product_id', 'product_id')
      .addSelect('order_items.quantity', 'quantity')
      .addSelect('order_items.price', 'price')
      .leftJoin(
        'order_items',
        'order_items',
        'order_items.order_id = orders.id',
      )
      .where('orders.user_id = :userId', { userId })
      .andWhere('order_items.product_id IN (:...productIds)', { productIds })
      .getRawMany();
    return orders as OrderItemsEntity[];
  }
  async updateOrderStatus(orderId: string, status: OrderStatusEnum) {
    await this.ordersRepository.update(orderId, { status });
  }
  private getTotalAmount(
    order: CreateOrderDto,
    productVariants: ProductVariantsEntity[],
  ): number {
    // Считаем общую стоимость заказа
    const totalAmount = productVariants.reduce((acc, product) => {
      const item = order.products.find(
        (item) => item.product_id === product.product_id,
      );
      if (!item) {
        return acc;
      }
      return acc + product.price * item.quantity;
    }, 0);
    return totalAmount;
  }
  async getOrdersByUserId(
    getOrdersDto: GetOrdersDto,
    userId: string,
  ): Promise<GetOrdersResponseDto[]> {
    const { pagination } = getOrdersDto;
    const { page, limit } = pagination;
    const orders = await this.ordersRepository
      .createQueryBuilder('orders')
      .select('orders.id', 'id')
      .addSelect('orders.status', 'status')
      .addSelect('orders.total_amount', 'total_amount')
      .addSelect('orders.created_at', 'created_at')
      .addSelect('orders.drop_id', 'drop_id')
      .addSelect('orders.tracking_number', 'tracking_number')
      .where('orders.user_id = :userId', { userId })
      .orderBy('orders.created_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();
    return orders.map((order) => this.getOrderMapper.toDto(order));
  }
}
