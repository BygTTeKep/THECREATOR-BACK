import { Injectable, Logger } from '@nestjs/common';
import { UnisenderEmailNotificationService } from './unisender/unisenderEmailNotification.service';
import { Repository } from 'typeorm';
import { NewsLetterEntity } from '../domain/entities/newsletter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToNewsletterDto } from './dtos/addToNewsletter.dto';
import { UsersService } from 'src/modules/users/infrastructure/services/users.service';
import { CheckEnableNewsletterDto } from './dtos/checkEnableNewsletter.dto';
import { UpdateNewsletterDto } from './dtos/updateNewsletter.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly unisenderService: UnisenderEmailNotificationService,
    @InjectRepository(NewsLetterEntity)
    private readonly newsLetterRepo: Repository<NewsLetterEntity>,
    private readonly usersService: UsersService,
  ) {}
  async sendEmailNotification(dto: any) {
    try {
      await this.unisenderService.sendEmail(dto);
    } catch (err) {
      this.logger.error(err);
    }
  }
  async addToNewsletter(dto: AddToNewsletterDto) {
    try {
      const user = await this.usersService.findByEmail(dto.email);
      await this.newsLetterRepo
        .createQueryBuilder()
        .insert()
        .values({
          email: dto.email,
          user_session_id: dto.user_session_id,
          user_id: user?.id,
          enable: dto.enable,
        })
        .orIgnore()
        .execute();
    } catch (err) {
      this.logger.debug(err);
    }
  }
  async isEnableNewsletter(dto: CheckEnableNewsletterDto): Promise<boolean> {
    try {
      const findBySessionIdOrUserId = this.newsLetterRepo
        .createQueryBuilder()
        .select(['enable'])
        .where('user_session_id = :session_id', { session_id: dto.session_id });
      if (dto.email)
        findBySessionIdOrUserId.orWhere('email = :email', {
          email: dto.email,
        });
      const res = await findBySessionIdOrUserId.getRawOne();
      return res?.enable !== null && res?.enable !== undefined && res?.enable;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }
  async updateNewsLetter(dto: UpdateNewsletterDto) {
    try {
      const exists = await this.newsLetterRepo.findOneBy({ email: dto.email });
      if (!exists) {
        await this.addToNewsletter({
          email: dto.email,
          user_session_id: dto.session_id,
          enable: dto.enable,
        });
      } else {
        await this.newsLetterRepo
          .createQueryBuilder()
          .update()
          .set({ enable: dto.enable })
          .where('email = :email', { email: dto.email })
          .execute();
      }
    } catch (err) {
      this.logger.error(err);
    }
  }
}
