import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { QueuesNameEnum } from 'src/modules/queues/domain/enums/queues.enum';
import { Subject } from './constants/subject.constant';
import { Description } from './constants/description.constant';
import { SendEmailDto } from '../dtos/sendEmail.dto';

type Lists = {
  id: number;
  title: string;
};

@Injectable()
export class UnisenderEmailNotificationService {
  private readonly logger = new Logger(UnisenderEmailNotificationService.name);
  private readonly UNISENDER_API_KEY: string;
  private readonly UNISENDER_API_URL: string;
  private readonly THECREATOR_MAIL: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const unisenderApiKey = this.configService.get<string>('UNISENDER_API_KEY');
    const unisenderApiUrl = this.configService.get<string>('UNISENDER_API_URL');
    const theCreatorMail = this.configService.get<string>('THECREATOR_MAIL');
    if (!unisenderApiKey) throw new Error('UNISENDER_API_KEY is not set');
    if (!unisenderApiUrl) throw new Error('UNISENDER_API_URL is not set');
    if (!theCreatorMail) throw new Error('THECREATOR_MAIL is not set');
    this.UNISENDER_API_KEY = unisenderApiKey;
    this.UNISENDER_API_URL = unisenderApiUrl;
    this.THECREATOR_MAIL = theCreatorMail;
  }
  async getListIdByNotifyName(notifyName: QueuesNameEnum) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.UNISENDER_API_URL}/getLists?format=json&api_key=${this.UNISENDER_API_KEY}`,
        ),
      );
      const resultList = response.data.result as Lists[];
      const result = resultList.find((r) => r.title === String(notifyName));
      return result;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
  async sendEmail(dto: SendEmailDto) {
    try {
      const listId = await this.getListIdByNotifyName(dto.messageType);
      if (!listId) {
        throw new Error('list id not found pls create or check');
      }
      const resp = await firstValueFrom(
        this.httpService.get(
          `${this.UNISENDER_API_URL}/sendEmail?format=json&api_key=${this.UNISENDER_API_KEY}&email=${dto.email}&sender_name=THE+CREATOR&sender_email=${this.THECREATOR_MAIL}&subject=${Subject[dto.messageType]}&body=${Description[dto.messageType]}&list_id=${listId.id}`,
        ),
      );
      this.logger.debug(resp);
    } catch (err) {
      this.logger.error(err.message);
      throw err;
    }
  }
}
