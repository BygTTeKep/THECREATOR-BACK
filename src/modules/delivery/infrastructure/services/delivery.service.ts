import { Injectable, Logger } from '@nestjs/common';
import { getCountryByPhone } from 'src/core/utils/getCountryByPhone';
import { DeliveryEntity } from '../../domain/entities/delivery.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SdekService } from './sdek/sdek.service';
import { CreateOrderDto } from './sdek/dtos/createOrder.dto';
import { Cache } from '@nestjs/cache-manager';
import { GetOrderInfoResponseDto } from './sdek/dtos/getOrderInfo.dto';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);
  private readonly deliveryCacheTtl = 60 * 60 * 24 * 1000; // 24 hours
  constructor(
    @InjectRepository(DeliveryEntity)
    private readonly deliveryRepository: Repository<DeliveryEntity>,
    private readonly sdekService: SdekService,
    private readonly cacheService: Cache,
  ) {}
  async getDeliveryByUserPhone(phone: string) {
    try {
      const countryCode = getCountryByPhone(phone);
      if (!countryCode) {
        throw new Error('Invalid phone number');
      }
      const delivery: DeliveryEntity[] | null | undefined =
        await this.deliveryRepository
          .createQueryBuilder('delivery')
          .select([
            'delivery.id as id',
            'delivery.name as name',
            'delivery.description as description',
          ])
          .leftJoin(
            'delivery_country',
            'delivery_country',
            'delivery_country.delivery_id = delivery.id',
          )
          .leftJoin(
            'countries',
            'countries',
            'countries.id = delivery_country.country_id',
          )
          .where('countries.code = :code', { code: countryCode })
          .getRawMany();
      if (!delivery) {
        throw new Error('Delivery not found');
      }
      console.log(delivery);
      return delivery;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Failed to get delivery by user country');
    }
  }

  async getLocationByCityName(cityName: string) {
    try {
      return this.sdekService.getLocationByCityName(cityName);
    } catch (error) {
      this.logger.error(error);
      throw new Error('Failed to get location by city name');
    }
  }
  async createOrder(order: CreateOrderDto) {
    try {
      return this.sdekService.createOrder(order);
    } catch (err) {
      this.logger.error(err);
      throw new Error('Failed to create order');
    }
  }
  async getDeliveryByOrderId(orderId: string) {
    try {
      const cachedDelivery = await this.cacheService.get(`delivery:${orderId}`);
      if (cachedDelivery) {
        return cachedDelivery as GetOrderInfoResponseDto;
      }
      console.log(orderId);
      const delivery = await this.sdekService.getInfoByOrderNumber(orderId);
      await this.cacheService.set(
        `delivery:${orderId}`,
        delivery,
        this.deliveryCacheTtl,
      );
      return delivery;
    } catch (error) {
      this.logger.error(error);
      throw new Error('Failed to get delivery by order id');
    }
  }
}
