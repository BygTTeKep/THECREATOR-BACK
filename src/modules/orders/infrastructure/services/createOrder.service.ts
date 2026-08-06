import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrdersEntity } from '../../domain/entities/orders.entity';
import {
  CreateOrderItemDto,
  CreateOrderMapper,
} from '../mappers/createOrder.mapper';
import { ProductsService } from 'src/modules/products/infrastructure/services/products.service';
import { RulesService } from 'src/modules/rules/infrastructure/services/rules.service';
import { UsersService } from 'src/modules/users/infrastructure/services/users.service';
import { FeatureFlagService } from 'src/modules/features-flag/infrastructure/services/featureFlag.service';
import { PaymentsService } from 'src/modules/payment/infrastructure/services/payments.service';
import { CreatePaymentMapper } from 'src/modules/payment/infrastructure/services/youkassa/mappers/createPayment.mapper';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeliveryService } from 'src/modules/delivery/infrastructure/services/delivery.service';
import { CreateOrderDto } from '../../presentation/dtos/createOrder.dto';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { OrderTypeEnum } from 'src/modules/delivery/infrastructure/services/sdek/enums/order/orderType.enum';
import { ContagentTypeEnum } from 'src/modules/delivery/infrastructure/services/sdek/dtos/recipient.dto';
import { PaymentTypeEnum } from 'src/core/enums/paymentType.enum';
import { OrderStatusEnum } from '../../domain/enums/ordersStatus.enum';
import { FeatureFlagEnum } from 'src/modules/features-flag/domain/enums/ff.enum';
import { PaymentVariantsEnum } from 'src/modules/payment/domain/enums/paymentVariants.enum';
import { CurrencyEnum } from 'src/modules/payment/domain/enums/currency.enum';
import { OrderItemsEntity } from '../../domain/entities/orderItems.entity';
import { TelegramEventsEnum } from 'src/modules/telegram/infrastructure/services/telegramEventsListener.service';
import { ProductVariantsEntity } from 'src/modules/products/domain/entities/productVariants.entity';
import { ProductsEntity } from 'src/modules/products/domain/entities/product.entity';

@Injectable()
export class CreateOrderService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
    private readonly createOrderMapper: CreateOrderMapper,
    private readonly productsService: ProductsService,
    private readonly rulesService: RulesService,
    private readonly usersService: UsersService,
    private readonly ffService: FeatureFlagService,
    private readonly paymentService: PaymentsService,
    private readonly createPaymentMapper: CreatePaymentMapper,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly deliveryService: DeliveryService,
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

          // Создаем заказ в СДЭК
          const orderInCourierService = await this.createOrderInCourierService(order, productVariants, user, products, totalAmount);

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
              delivery_type: order.delivery_type,
              order_type: order.order_type,
              payment_type: order.payment_type,
              address: order.shippingAddress,
            }),
          );
          const paymentUrl = await this.createPaymentInPaymentSystem(newOrder.id, totalAmount);
          if (paymentUrl) {
            returnUrl = paymentUrl;
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
          this.eventEmitter.emit(
            TelegramEventsEnum.ORDER_CREATED,
            `
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
          `,
          );
          // await this.telegramService.sendMessage();

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
      throw new BadRequestException((error as Error).message);
    }
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
  private async createOrderInCourierService(
    order: CreateOrderDto,
    productVariants: ProductVariantsEntity[],
    user: UserEntity,
    products: ProductsEntity[],
    totalAmount: number,
  ): Promise<string> {
    // Создаем заказ в СДЭК
    const orderInCourierService = await this.deliveryService.createOrder({
      type: OrderTypeEnum.ONLINE_STORE,
      tariff_code: '',
      recipient: {
        phones: [user.phone],
        name: order.fullName,
        contragent_type: ContagentTypeEnum.INDIVIDUAL,
      },
      packages: products.map((product) => {
        const metadata = product.metadata; //TODO: при создании продукта добавлять metadata
        const variant = productVariants.filter(
          (variant) => variant.product_id === product.id,
        );
        if (variant.length === 0) {
          throw new BadRequestException('Variant not found');
        }
        return {
          number: product.id,
          weight: metadata.weight,
          length: metadata.length,
          width: metadata.width,
          height: metadata.height,
          items: variant.map((variant) => ({
            name: product.name,
            ware_key: variant.sku,
            payment: {
              value:
                order.payment_type === PaymentTypeEnum.now ? variant.price : 0,
            },
            weight: metadata.weight,
            amount: totalAmount,
            cost: variant.price,
          })),
        };
      }),
    });
    return orderInCourierService;
  }
  private async createPaymentInPaymentSystem(newOrderId: string, totalAmount: number): Promise<string | null> {
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
          description: `Payment for the order ${newOrderId}`,
        }),
      );
    return payment.confirmation.confirmation_url;
  }
  return null;
  }
  
}
