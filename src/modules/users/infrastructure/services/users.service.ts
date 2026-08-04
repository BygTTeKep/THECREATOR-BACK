import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserRequestDto } from '../../presentation/dtos/createUser.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateUserMapper } from '../mappers/createUser.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserStatus } from '../../domain/enums/userStatus.enum';
import { SubscriptionsService } from 'src/modules/subscriptions/infrastructure/services/subscriptions.service';
import { TiersService } from 'src/modules/tiers/infrastructure/services/tiers.service';
import { CreateSubscriptionDto } from 'src/modules/subscriptions/presentation/dtos/createSubscription.dto';
import { GetUserByIdResponseDto } from '../../presentation/dtos/getUserById.dto';
import { GetUserByIdMapper } from '../mappers/getUserById.mapper';
import { getCountryByPhone } from 'src/core/utils/getCountryByPhone';
import {
  GetUserDto,
  GetUserResponseDto,
} from '../../presentation/dtos/getUser.dto';
import { GetUsersMapper } from '../mappers/getUsers.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly createUserMapper: CreateUserMapper,
    private readonly configService: ConfigService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly tiersService: TiersService,
    private readonly getUserByIdMapper: GetUserByIdMapper,
    private readonly getUserMapper: GetUsersMapper,
  ) {}

  async getAllActiveUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find({ where: { status: UserStatus.ACTIVE } });
  }

  /**
   * Создание пользователя
   * @param dto - DTO для создания пользователя
   * @returns пользователь
   */
  async createUser(dto: CreateUserRequestDto) {
    const createUserDto = this.createUserMapper.toDto(dto);
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findByPhone(phone: string) {
    return this.usersRepository.findOne({ where: { phone } });
  }

  async findByPhoneWithPassword(phone: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.phone = :phone', { phone })
      .getOne();
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async getUserById(id: string): Promise<GetUserByIdResponseDto> {
    const haveActiveSubscription =
      await this.subscriptionsService.getSubscriptionByUserId(id);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const language = getCountryByPhone(user.phone);

    return this.getUserByIdMapper.toDto(
      user,
      !!haveActiveSubscription,
      language ?? 'EN',
    );
  }
  async updateUser(id: string, user: Partial<UserEntity>): Promise<UserEntity> {
    const existingUser = await this.usersRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    Object.assign(existingUser, user);
    return this.usersRepository.save(existingUser);
  }

  async updateUserSubscription(
    userId: string,
    createSubscriptionDto: CreateSubscriptionDto,
  ) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.subscriptionsService.createSubscription(
      user,
      createSubscriptionDto,
    );
    const recalculatedTiers = await this.recalculateTiers([user]);
    for (const recalculatedTier of recalculatedTiers) {
      await this.updateUser(recalculatedTier.userId, {
        current_tier_id: recalculatedTier.tierId,
      });
    }
  }
  /**
   * Пересчет тарифов для пользователей
   *
   * @param users пользователи для пересчета
   * @returns массив пользователей с пересчитанными тарифами
   */
  async recalculateTiers(
    users: UserEntity[],
  ): Promise<{ userId: string; tierId: number }[]> {
    const result: { userId: string; tierId: number }[] = [];
    const subscriptions = await this.subscriptionsService.getSubscriptions(
      users.map((user) => user.id),
    );
    for (const user of users) {
      const subscription = subscriptions.find(
        (subscription) => subscription.user_id === user.id,
      );
      if (subscription) {
        const months = Math.floor(
          (new Date().getTime() - new Date(subscription.started_at).getTime()) /
            (1000 * 60 * 60 * 24 * 30),
        );
        const tier = await this.tiersService.getTierByMonths(months);
        if (tier && user.current_tier_id !== tier?.id) {
          result.push({ userId: user.id, tierId: tier.id });
        }
      }
    }
    return result;
  }

  async getUsersByFilter(dto: GetUserDto): Promise<GetUserResponseDto[]> {
    const { filters, pagination } = dto;
    const { limit, page } = pagination;
    const usersQuery = this.usersRepository
      .createQueryBuilder()
      .select([
        'id',
        'email',
        'phone',
        'status',
        'total_months',
        'created_at',
        'current_tier_id',
      ])
      .limit(limit)
      .offset((page - 1) * limit);
    if (filters?.emails?.length) {
      usersQuery.andWhere('email IN (:...emails)', { emails: filters.emails });
    }
    if (filters?.phones?.length) {
      usersQuery.andWhere('phone IN (:...phones)', { phones: filters.phones });
    }
    if (filters.status !== null && filters.status !== undefined) {
      usersQuery.andWhere('status = :status', { status: filters.status });
    }
    const users = await usersQuery.getRawMany();
    const results = this.getUserMapper.toDto(users);
    return results;
  }

  async getCountRegUsers(): Promise<number> {
    const count = await this.usersRepository.createQueryBuilder().getCount();
    return count;
  }
}
