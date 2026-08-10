import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { SdekGetAccessTokenService } from './sdekGetAccessToken.service';

const WIDGET_VERSION = '3.11.1';

export type SdekMapsWidgetResult = {
  httpCode: number;
  result: unknown;
  addedHeaders: Record<string, string>;
};

@Injectable()
export class SdekMapsWidgetService {
  private readonly logger = new Logger(SdekMapsWidgetService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly sdekGetAccessTokenService: SdekGetAccessTokenService,
  ) {}

  async process(
    requestData: Record<string, unknown>,
  ): Promise<SdekMapsWidgetResult> {
    if (!requestData.action) {
      throw new BadRequestException({ message: 'Action is required' });
    }

    const accessToken =
      await this.sdekGetAccessTokenService.getOrSetAccessToken();
    if (!accessToken) {
      throw new UnauthorizedException('Server not authorized to CDEK API');
    }

    switch (requestData.action) {
      case 'offices':
        return this.getOffices(requestData, accessToken);
      case 'calculate':
        return this.calculate(requestData, accessToken);
      default:
        throw new BadRequestException({ message: 'Unknown action' });
    }
  }

  private widgetHeaders(accessToken: string) {
    return {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-App-Name': 'widget_pvz',
      'X-App-Version': WIDGET_VERSION,
      'User-Agent': `widget/${WIDGET_VERSION}`,
    };
  }

  private toResult(response: AxiosResponse): SdekMapsWidgetResult {
    const addedHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(response.headers)) {
      if (!key.toLowerCase().startsWith('x-') || value == null) continue;
      addedHeaders[key] = Array.isArray(value)
        ? value.join(', ')
        : String(value);
    }
    return {
      httpCode: response.status,
      result: response.data,
      addedHeaders,
    };
  }

  private async getOffices(
    requestData: Record<string, unknown>,
    accessToken: string,
  ): Promise<SdekMapsWidgetResult> {
    try {
      const response = await firstValueFrom(
        this.httpService.get('/deliverypoints', {
          params: requestData,
          headers: this.widgetHeaders(accessToken),
          validateStatus: () => true,
        }),
      );
      return this.toResult(response);
    } catch (error) {
      this.logger.error(error?.message);
      throw 'error';
    }
  }

  private async calculate(
    requestData: Record<string, unknown>,
    accessToken: string,
  ): Promise<SdekMapsWidgetResult> {
    try {
      const response = await firstValueFrom(
        this.httpService.post('/calculator/tarifflist', requestData, {
          headers: {
            ...this.widgetHeaders(accessToken),
            'Content-Type': 'application/json',
          },
          validateStatus: () => true,
        }),
      );
      return this.toResult(response);
    } catch (error) {
      this.logger.error(error?.message);
      throw 'error';
    }
  }
}

export { WIDGET_VERSION };
