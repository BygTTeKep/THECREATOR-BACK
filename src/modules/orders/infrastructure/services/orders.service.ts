import { OrdersEntity } from '../../domain/entities/orders.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto, CreateOrderForNoAuthUserDto } from '../../presentation/dtos/createOrder.dto';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { OrderStatusEnum } from '../../domain/enums/ordersStatus.enum';

import { OrderItemsEntity } from '../../domain/entities/orderItems.entity';

import {
  GetOrdersDto,
  GetOrdersResponseDto,
} from '../../presentation/dtos/getOrders.dto';
import { GetOrderMapper } from '../mappers/getOrder.mapper';
import { GetOrdersAdminDto } from '../../presentation/dtos/getOrderForAdmin.dto';
import { UpdateOrderDto } from '../../presentation/dtos/updateOrder.dto';
import { GetOrderByIdResponseDto } from '../../presentation/dtos/getOrderById.dto';
import { GetOrderByIdMapper } from '../mappers/getOrderById.mapper';
import { CreateOrderService } from './createOrder.service';
import { DeliveryService } from 'src/modules/delivery/infrastructure/services/delivery.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private readonly activeOrderStatuses = [
    OrderStatusEnum.ORDER_IN_TRANSIT,
    OrderStatusEnum.PAID,
    OrderStatusEnum.PICKED_UP,
    OrderStatusEnum.PENDING,
    OrderStatusEnum.ORDER_DELIVERED,
  ];
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly ordersRepository: Repository<OrdersEntity>,

    private readonly getOrderMapper: GetOrderMapper,
    private readonly getOrderByIdMapper: GetOrderByIdMapper,
    private readonly createOrderService: CreateOrderService,
    private readonly deliveryService: DeliveryService,
  ) {}
  async createOrder(
    order: CreateOrderDto,
    user: UserEntity,
  ): Promise<string | null> {
    try {
      return await this.createOrderService.createOrder(order, user);
    } catch (error) {
      if (error?.response?.data) {
        this.logger.error(error?.response?.data?.message);
      } else {
        this.logger.error(error);
      }
      throw 'error';
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
      .addSelect('orders.order_type', 'order_type')
      .addSelect('orders.payment_type', 'payment_type')
      .addSelect('orders.address', 'address')
      .addSelect('orders.id_in_courier_service', 'id_in_courier_service')
      .where('orders.user_id = :userId', { userId })
      .orderBy('orders.created_at', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit)
      .getRawMany();
    const activeOrders = orders.filter((order) =>
      this.activeOrderStatuses.includes(order.status as OrderStatusEnum),
    );
    const deliveryPromises = activeOrders.map((order) =>
      this.deliveryService.getDeliveryByOrderId(order.id_in_courier_service),
    );
    const deliveries = await Promise.all(deliveryPromises);
    const deliveryMap = new Map(
      deliveries.map((delivery) => [delivery.entity?.cdek_number, delivery]),
    );
    orders.forEach((order) => {
      order.planned_delivery_date = deliveryMap.get(
        order.id_in_courier_service,
      )?.entity?.planned_delivery_date;
      order.tracking_number = deliveryMap.get(
        order.id_in_courier_service,
      )?.entity?.cdek_number;
    });

    return orders.map((order) => this.getOrderMapper.toDto(order));
  }

  async getOrdersAdmin(
    getOrdersAdminDto: GetOrdersAdminDto,
  ): Promise<GetOrdersResponseDto[]> {
    const { pagination, filters, sorting } = getOrdersAdminDto;
    const { page, limit } = pagination;
    const { status, emails } = filters;
    const { field, order } = sorting;
    const ordersQueryBuilder = this.ordersRepository
      .createQueryBuilder('orders')
      .select([
        'orders.id as id',
        'orders.status as status',
        'orders.total_amount as total_amount',
        'orders.created_at as created_at',
        'orders.drop_id as drop_id',
        'orders.tracking_number as tracking_number',
        'orders.order_type as order_type',
      ])
      .limit(limit)
      .offset((page - 1) * limit);
    if (field) {
      ordersQueryBuilder.orderBy(`orders.${field}`, order);
    }
    if (filters.status) {
      ordersQueryBuilder.andWhere('orders.status = :status', { status });
    }
    if (filters.emails) {
      ordersQueryBuilder.leftJoin(
        'users',
        'users',
        'users.id = orders.user_id',
      );
      ordersQueryBuilder.andWhere('users.email IN (:...emails)', { emails });
    }
    const orders = await ordersQueryBuilder.getRawMany();
    return orders.map((order) => this.getOrderMapper.toDto(order));
  }
  async getOrdersAdminDetails(
    orderId: string,
  ): Promise<GetOrderByIdResponseDto> {
    const order = await this.ordersRepository
      .createQueryBuilder('orders')
      .select([
        'orders.id as id',
        'orders.status as order_status',
        'orders.total_amount as total_amount',
        'orders.created_at as created_at',
        'orders.drop_id as drop_id',
        'orders.tracking_number as tracking_number',
        'orders.delivery_type as delivery_type',
        'orders.delivery_method as delivery_method',
        'orders.order_type as order_type',
        'users.email as email',
        'users.phone as phone',
        'users.metadata as metadata',
        'users.status as user_status',
        'users.total_months as total_months',
        'users.current_tier_id as current_tier_id',
        'orders.metadata as metadata',
      ])
      .leftJoin('users', 'users', 'users.id = orders.user_id')
      .where('orders.id = :orderId', { orderId })
      .getRawOne();
    return this.getOrderByIdMapper.toDto(order);
  }
  async updateOrder(
    orderId: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<void> {
    try {
      if (Object.keys(updateOrderDto).length < 1) return;

      const updateData: Partial<OrdersEntity> = {};

      if (updateOrderDto.status) {
        updateData.status = updateOrderDto.status;
      }

      if (updateOrderDto.tracking_number) {
        updateData.tracking_number = updateOrderDto.tracking_number;
      }

      await this.ordersRepository
        .createQueryBuilder()
        .update()
        .set(updateData)
        .where('id = :id', { id: orderId })
        .execute();
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async createOrderForNoAuthUser(
    createOrderDto: CreateOrderForNoAuthUserDto,
  ): Promise<string | null> {
    return await this.createOrderService.createOrderForNoAuthUser(createOrderDto);
  }
}
