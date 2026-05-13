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

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,
    @InjectRepository(OrderItemsEntity)
    private readonly orderItemsRepository: Repository<OrderItemsEntity>,
    private readonly createOrderMapper: CreateOrderMapper,
    private readonly productsService: ProductsService,
    private readonly rulesService: RulesService,
    private readonly telegramService: TelegramService,
    private readonly usersService: UsersService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}
  async createOrder(order: CreateOrderDto, user: UserEntity) {
    // TODO обвернуть в транзакцию и сделать rollback при ошибке
    // Проверяем, может ли пользователь купить этот продукт
    try {
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
          const totalAmount = productVariants.reduce((acc, product) => {
            const item = order.products.find(
              (item) => item.product_id === product.product_id,
            );
            if (!item) {
              return acc;
            }
            return acc + product.price * item.quantity;
          }, 0);
          // Создаем новый заказ
          const newOrder = await transactionalEntityManager.save(
            OrdersEntity,
            this.ordersRepository.create({
              user_id: user.id,
              status: OrderStatusEnum.PENDING,
              total_amount: totalAmount,
              created_at: new Date(),
              drop_id: order.dropId,
            }),
          );
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

          return newOrder;
        },
      );
      await this.usersService.updateUser(user.id, {
        metadata: {
          ...user.metadata,
          fullName: order.fullName,
          shippingAddress: order.shippingAddress,
        },
      });
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
}
