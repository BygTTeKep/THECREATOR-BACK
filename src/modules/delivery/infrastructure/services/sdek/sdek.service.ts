import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AuthResponseDto } from './dtos/auth.dto';
import { CreateOrderDto } from './dtos/createOrder.dto';

export class SdekService {
  private readonly logger: Logger = new Logger(SdekService.name);
  private readonly grantType = 'client_credentials';
  private readonly clientId = this.configService.get<string>('SDEK_CLIENT_ID');
  private readonly clientSecret =
    this.configService.get<string>('SDEK_CLIENT_SECRET');
  private readonly accessToken: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get<string>('SDEK_BASE_URL');
    const accessToken = this.configService.get<string>('SDEK_ACCESS_TOKEN');
    if (!accessToken) {
      throw new UnauthorizedException('SDEK_ACCESS_TOKEN is not set');
    }
    this.accessToken = accessToken;
    this.httpService.axiosRef.defaults.baseURL = baseUrl;
    this.httpService.axiosRef.defaults.headers.common['Authorization'] =
      `Bearer ${this.accessToken}`;
  }
  async auth(): Promise<AuthResponseDto> {
    const response = await firstValueFrom(
      this.httpService.post('/oauth/token', {
        grant_type: this.grantType,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    );

    console.log(response);
    if (response.status !== 200) {
      throw new UnauthorizedException(response.data?.error_description);
    }
    return response.data as AuthResponseDto;
  }
  async getLocationByCityName(cityName: string) {
    // TODO добавть dto Ответа
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `/location/suggest/cities`,
          {
            name: cityName,
          },
          {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
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
  async createOrder(order: CreateOrderDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/orders', {
          order: order,
        }),
      );
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
      const params = {
        order_number: orderNumber,
      };
      if (im_number) {
        params['im_number'] = im_number;
      }
      const response = await firstValueFrom(
        this.httpService.get(`/orders/`, {
          params,
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
      const response = await firstValueFrom(
        this.httpService.get('/deliverypoints', {
          params,
        }),
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
