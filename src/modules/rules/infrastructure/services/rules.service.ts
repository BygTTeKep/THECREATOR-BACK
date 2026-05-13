import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DropAccessRulesEntity } from '../../domain/entities/dropAccessRules.entity';
import { WhitelistEntity } from '../../domain/entities/whitelist.entity';
import { DataSource, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { SubscriptionsService } from 'src/modules/subscriptions/infrastructure/services/subscriptions.service';
import { CreateRuleForDropDto } from '../../presentation/dtos/createRuleForDrop.dto';
import { TiersService } from 'src/modules/tiers/infrastructure/services/tiers.service';
import { UpdateRuleForDropDto } from '../dtos/updateRuleForDrop.dto';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(DropAccessRulesEntity)
    private readonly dropAccessRulesRepository: Repository<DropAccessRulesEntity>,
    @InjectRepository(WhitelistEntity)
    private readonly whitelistRepository: Repository<WhitelistEntity>,
    private readonly subscriptionsService: SubscriptionsService,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly tiersService: TiersService,
  ) {}
  async canUserBuyProduct(user: UserEntity, dropId: number) {
    const orders = await this.dataSource
      .createQueryBuilder()
      .select('*')
      .from('orders', 'o')
      .where('user_id = :userId', { userId: user.id })
      .andWhere('drop_id = :dropId', { dropId: dropId })
      .getRawMany();
    if (orders.length > 0) {
      return false;
    }
    const dropAccessRules = await this.dropAccessRulesRepository.findOne({
      where: {
        drop_id: dropId,
      },
    });
    if (!dropAccessRules) {
      return true;
    }
    if (
      dropAccessRules.min_tier_id &&
      user.current_tier_id &&
      dropAccessRules.min_tier_id > user.current_tier_id
    ) {
      return false;
    }
    if (dropAccessRules.whitelist_only) {
      const whitelist = await this.whitelistRepository.findOne({
        where: {
          user_id: user.id,
          drop_id: dropId,
        },
      });
      if (!whitelist) {
        return false;
      }
    }
    const subscription =
      await this.subscriptionsService.getNotCanceledSubscriptions([user.id]);
    if (!subscription) {
      return false;
    }

    if (dropAccessRules.min_months > subscription.length) {
      return false;
    }

    return true;
  }
  async createRuleForDrop(createRuleDto: CreateRuleForDropDto) {
    const existingRule = await this.dropAccessRulesRepository.findOne({
      where: {
        drop_id: createRuleDto.dropId,
      },
    });
    if (existingRule) {
      throw new BadRequestException('Rule for this drop already exists');
    }
    const tier = await this.tiersService.getTierById(createRuleDto.minTierId);
    if (!tier) {
      throw new BadRequestException('Tier not found');
    }
    const rule = this.dropAccessRulesRepository.create({
      drop_id: createRuleDto.dropId,
      min_tier_id: createRuleDto.minTierId,
      whitelist_only: createRuleDto.whitelistOnly,
      min_months: tier?.min_months ?? 0,
    });
    return await this.dropAccessRulesRepository.save(rule);
  }
  async updateRuleForDrop(dropId: number, updateRuleDto: UpdateRuleForDropDto) {
    const existingRule = await this.dropAccessRulesRepository.findOne({
      where: {
        drop_id: dropId,
      },
    });
    if (!existingRule) {
      throw new BadRequestException('Rule for this drop not found');
    }
    if (updateRuleDto.minTierId) {
      existingRule.min_tier_id = updateRuleDto.minTierId;
    }
    if (updateRuleDto.minMonths) {
      existingRule.min_months = updateRuleDto.minMonths;
    }
    if (updateRuleDto.whitelistOnly) {
      existingRule.whitelist_only = updateRuleDto.whitelistOnly;
    }
    return await this.dropAccessRulesRepository.save(existingRule);
  }
}
