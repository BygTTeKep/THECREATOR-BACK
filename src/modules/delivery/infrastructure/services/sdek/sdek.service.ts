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
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async createOrder(order: CreateOrderDto) {
    try {
      const accessToken =
        await this.sdekGetAccessTokenService.getOrSetAccessToken();
      const response = await firstValueFrom(
        this.httpService.post(
          '/orders',
          {
            order: order,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        ),
      );
      if (response.status !== 200) {
        throw new BadRequestException(response.data?.errors);
      }
      return response.data;
    } catch (error) {
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
  async getInfoByOrderNumber(orderNumber: string, im_number?: string) {
    try {
      const accessToken =
        await this.sdekGetAccessTokenService.getOrSetAccessToken();
      const params = {
        order_number: orderNumber,
      };
      if (im_number) {
        params['im_number'] = im_number;
      }
      const response = await firstValueFrom(
        this.httpService.get(`/orders/`, {
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
      this.logger.error(error);
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
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
