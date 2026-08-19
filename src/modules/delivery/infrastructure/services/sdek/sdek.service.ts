import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { SdekGetAccessTokenService } from './sdekGetAccessToken.service';
import { GetOrderInfoResponseDto } from './dtos/getOrderInfo.dto';

@Injectable()
export class SdekService {
  private readonly logger: Logger = new Logger(SdekService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly sdekGetAccessTokenService: SdekGetAccessTokenService,
  ) {
    const baseUrl = this.configService.get<string>('SDEK_BASE_URL');

    this.httpService.axiosRef.defaults.baseURL = baseUrl;
  }

  async getLocationByCityName(cityName: string) {
    // TODO добавть dto Ответа
    try {
      const accessToken =
        await this.sdekGetAccessTokenService.getOrSetAccessToken();
      const response = await firstValueFrom(
        this.httpService.get(`/location/suggest/cities`, {
          params: {
            name: cityName,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      if (response.status !== 200) {
        throw new BadRequestException(response.data?.errors);
      }
      return response.data;
    } catch (error) {
      this.logger.error(error?.response?.data);
      throw new InternalServerErrorException();
    }
  }
  async createOrder(order: CreateOrderDto): Promise<string> {
    try {
      this.logger.log('createOrder', order);
      const accessToken =
        await this.sdekGetAccessTokenService.getOrSetAccessToken();
      const response = await firstValueFrom(
        this.httpService.post(
          '/orders',
          {
            ...order,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );
      this.logger.log('response status', response.status);
      if (response.status !== 202) {
        this.logger.error(response.data);
        throw new BadRequestException(response.data?.errors);
      }
      const orderResponse = response.data;
      const orderId = orderResponse.entity.uuid;
      return orderId;
    } catch (error) {
      if (error?.response?.data?.requests) {
        this.logger.error(error?.response?.data?.requests);
        throw new Error(error?.response?.data?.requests);
      }
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  /**
   * Получает информацию о заказе по номеру заказа или номеру заказа в ИМ
   * @param orderNumber - Номер заказа СДЭК, по которому необходима информация
   * @param im_number - Номер заказа в ИС Клиента, по которому необходима информация
   * @returns Информация о заказе
   */
  async getInfoByOrderNumber(
    orderNumber: string,
    im_number?: string,
  ): Promise<GetOrderInfoResponseDto> {
    try {
      const accessToken =
        await this.sdekGetAccessTokenService.getOrSetAccessToken();
      const params = {
        cdek_number: orderNumber,
      };
      if (im_number) {
        params['im_number'] = im_number;
      }
      console.log(params);
      const response = await firstValueFrom(
        this.httpService.get(`/orders/${orderNumber}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      if (response.status !== 200) {
        throw new BadRequestException(response.data?.errors);
      }
      return response.data;
    } catch (error) {
      this.logger.error(error?.response?.data);
      throw new InternalServerErrorException();
    }
  }
  /**
   *
   * @param params - Параметры запроса
   * @returns Список ПВЗ
   */
  async getOffices(params: any) {
    try {
      const accessToken =
        await this.sdekGetAccessTokenService.getOrSetAccessToken();
      const response = await firstValueFrom(
        this.httpService.get('/deliverypoints', {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }),
      );
      if (response.status !== 200) {
        throw new BadRequestException(response.data?.errors);
      }
      return response.data;
    } catch (error) {
      this.logger.error(error?.response?.data);
      throw new InternalServerErrorException();
    }
  }
}
