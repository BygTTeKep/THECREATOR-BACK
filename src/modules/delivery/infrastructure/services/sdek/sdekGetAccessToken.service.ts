import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthResponseDto } from './dtos/auth.dto';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Cache } from '@nestjs/cache-manager';
import { encrypt } from 'src/core/utils/secret/encrypt';
import { decrypt } from 'src/core/utils/secret/decrypt';
import { SDEK_ACCESS_CACHE_KEY } from './constants/cacheConstant';

@Injectable()
export class SdekGetAccessTokenService {
  private readonly logger = new Logger(SdekGetAccessTokenService.name);
  private readonly clientId = this.configService.get<string>('SDEK_CLIENT_ID');
  private readonly clientSecret =
    this.configService.get<string>('SDEK_CLIENT_SECRET');
  private readonly grantType = 'client_credentials';
  private readonly KEY = SDEK_ACCESS_CACHE_KEY;
  private readonly SDEK_ACCESS_TOKEN_CACHE_SECRET =
    this.configService.get<string>('SDEK_ACCESS_TOKEN_CACHE_SECRET') || '';
  constructor(
    private readonly httpService: HttpService,
    private readonly cacheManager: Cache,
    private readonly configService: ConfigService,
  ) {
    const baseUrl = this.configService.get<string>('SDEK_BASE_URL');

    this.httpService.axiosRef.defaults.baseURL = baseUrl;

  }
  /**
   * метод для получения токена sdek
   * он действует 3600 сек или 1 час
   * @returns AuthResponseDto
   */
  private async auth(): Promise<AuthResponseDto> {
    const response = await firstValueFrom(
      this.httpService.post('/oauth/token', {
        grant_type: this.grantType,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    );

    if (response.status !== 200) {
      throw new UnauthorizedException(response.data?.error_description);
    }
    const res = response.data as AuthResponseDto;
    await this.cacheAccessToken(res.access_token, res.expires_in);
    return response.data as AuthResponseDto;
  }
  /**
   *
   * @param accessToken
   * @param ttl
   */
  private async cacheAccessToken(accessToken: string, ttl: number) {
    const encrypted = encrypt(accessToken, this.SDEK_ACCESS_TOKEN_CACHE_SECRET);
    await this.cacheManager.set(this.KEY, encrypted, ttl * 1000);
  }

  /**
   *
   * @returns
   */
  private async getAccessToken() {
    const at = (await this.cacheManager.get(this.KEY)) as string;
    if (!at) return '';
    const decr = decrypt(at, this.SDEK_ACCESS_TOKEN_CACHE_SECRET);
    return decr;
  }

  /**
   *
   * @returns
   */
  async getOrSetAccessToken() {
    try {
      let token = await this.getAccessToken();
      if (!token) {
        await this.auth();
      }
      token = await this.getAccessToken();
      return token;
    } catch (error) {
      console.log(this.SDEK_ACCESS_TOKEN_CACHE_SECRET);
      console.log(this.KEY);
      console.log(this.clientId);
      console.log(this.clientSecret);
      console.log(this.grantType);
      this.logger.error(error);
      throw 'error';
    }
  }
}
