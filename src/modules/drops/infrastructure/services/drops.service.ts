import { InjectRepository } from '@nestjs/typeorm';
import { DropsEntity } from '../../domain/entities/dtops.entity';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { In, LessThan, Repository } from 'typeorm';
import {
  GetDropsDto,
  GetDropsResponseWithPageCountDto,
} from '../../presentation/dtos/getDrops.dto';
import { CreateDropDto } from '../../presentation/dtos/createDrop.dto';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { GetDropByIdMapper } from '../mappers/getDropById.mapper';
import { RulesService } from 'src/modules/rules/infrastructure/services/rules.service';
import { DropsFilesEntity } from '../../domain/entities/dropsFiles.entity';
import { GetDropsMapper } from '../mappers/getDrops.mapper';
import { UpdateDropDto } from '../../presentation/dtos/updateDrop.dto';
import { ProductsService } from 'src/modules/products/infrastructure/services/products.service';
import { TiersService } from 'src/modules/tiers/infrastructure/services/tiers.service';
import { RolesEnum } from 'src/core/enums/roles.enum';

@Injectable()
export class DropsService {
  private readonly logger = new Logger(DropsService.name);
  constructor(
    @InjectRepository(DropsEntity)
    private readonly dropsRepository: Repository<DropsEntity>,
    private readonly getDropByIdMapper: GetDropByIdMapper,
    private readonly rulesService: RulesService,
    @InjectRepository(DropsFilesEntity)
    private readonly dropsFilesRepository: Repository<DropsFilesEntity>,
    private readonly getDropsMapper: GetDropsMapper,
    private readonly productsService: ProductsService,
    private readonly tiersService: TiersService,
  ) {}
  async getAllDrops(
    getDropsDto: GetDropsDto,
    user?: UserEntity,
  ): Promise<GetDropsResponseWithPageCountDto> {
    const { pagination, filters } = getDropsDto;
    const { page, limit } = pagination;
    const { is_active, date, tier, drop_type, drop_line } = filters;

    const query = this.dropsRepository
      .createQueryBuilder('drops')
      .select([
        'drops.id as id',
        'drops.name as name',
        'drops.description as description',
        'drops.starts_at as starts_at',
        'drops.ends_at as ends_at',
        'drops.is_active as is_active',
        'drops.tier as tier',
        'drops.drop_type as drop_type',
        'drops.drop_line as drop_line',
      ]);
    if ((user && user.metadata.role !== RolesEnum.ADMIN) || !user) {
      query.where('drops.is_visible = true');
    }

    if (is_active !== undefined) {
      query.where('drops.is_active = :is_active', { is_active });
    }
    if (date) {
      if (date.starts_at) {
        query.andWhere('drops.starts_at >= :starts_at', {
          starts_at: date.starts_at,
        });
      }
      if (date.ends_at) {
        query.andWhere('drops.ends_at <= :ends_at', {
          ends_at: date.ends_at,
        });
      }
    }
    if (tier) {
      query.where('drops.tier = :tier', { tier });
    }
    if (drop_type) {
      query.andWhere('drops.drop_type = :dt', { dt: drop_type });
    }
    if (drop_line) {
      query.andWhere('drops.drop_line = :dl', { dl: drop_line });
    }
    const count = await query.getCount();
    query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('drops.starts_at', 'ASC');
    const drops = await query.getRawMany();
    const dropFiles = await this.dropsFilesRepository.find({
      where: { drop_id: In(drops.map((drop: any) => drop.id)) },
      order: { priority: 'ASC' },
    });
    const products = await this.productsService.getProductsByIds(
      drops.map((drop) => drop.id),
    );
    const productsPrice = await this.productsService.getProductsPriceByDropIds(
      drops.map((drop) => drop.id),
    );
    const response = this.getDropsMapper.toDto(
      drops,
      dropFiles,
      Math.ceil(count / limit),
      products,
      productsPrice,
    );
    return response;
  }
  async createDrop(createDropDto: CreateDropDto) {
    if (createDropDto.tier !== createDropDto.rule.minTierId) {
      throw new BadRequestException('Tier and rule tier must be the same');
    }
    const drop = await this.dropsRepository.save(
      this.dropsRepository.create({
        name: createDropDto.name,
        description: createDropDto.description,
        starts_at: createDropDto.starts_at,
        ends_at: createDropDto.ends_at,
        is_active: createDropDto.is_active,
        tier: createDropDto.tier,
        is_visible: createDropDto.is_visible ?? true,
        drop_type: createDropDto.drop_type,
        drop_line: createDropDto.drop_line,
      }),
    );
    await this.rulesService.createRuleForDrop({
      dropId: drop.id,
      minTierId: createDropDto.rule.minTierId,
      whitelistOnly: createDropDto.rule.whitelistOnly,
    });
    if (createDropDto.files) {
      const dropsFiles = createDropDto.files.map((file) =>
        this.dropsFilesRepository.create({
          drop_id: drop.id,
          file_url: file.file_url,
          priority: file.priority,
        }),
      );
      await this.dropsFilesRepository.save(dropsFiles);
    }
    return drop;
  }
  async getDropById(id: number, user?: UserEntity) {
    const drop = await this.dropsRepository.findOne({ where: { id: id } });
    if (!drop) {
      throw new NotFoundException('Drop not found');
    }
    const products = await this.productsService.getProductsByDropId(id);
    const files = await this.dropsFilesRepository.find({
      where: { drop_id: id },
      order: { priority: 'ASC' },
    });
    const canBuy = user
      ? await this.rulesService.canUserBuyProduct(user, id)
      : false;
    return this.getDropByIdMapper.toDto(drop, products, canBuy, files);
  }
  async updateDrop(id: number, updateDropDto: UpdateDropDto) {
    const drop = await this.dropsRepository.findOne({ where: { id: id } });
    if (!drop) {
      throw new NotFoundException('Drop not found');
    }
    if (updateDropDto.tier) {
      const tier = await this.tiersService.getTierById(updateDropDto.tier);
      if (!tier) {
        throw new NotFoundException('Tier not found');
      }
      await this.rulesService.updateRuleForDrop(id, {
        minTierId: updateDropDto.tier,
        minMonths: tier.min_months,
      });
    }
    if (updateDropDto.files) {
      await this.dropsFilesRepository.delete({ drop_id: id });
      const dropsFiles = updateDropDto.files.map((file) =>
        this.dropsFilesRepository.create({
          drop_id: id,
          file_url: file.file_url,
          priority: file.priority,
        }),
      );
      await this.dropsFilesRepository.save(dropsFiles);
      delete updateDropDto.files;
    }

    await this.dropsRepository.update(id, updateDropDto);
    return drop;
  }
  async autoDeactivateDrop() {
    try {
      const drops = await this.dropsRepository.find({
        where: {
          is_active: true,
          ends_at: LessThan(new Date()),
        },
      });
      for (const drop of drops) {
        await this.dropsRepository.update(drop.id, { is_active: false });
      }
      this.logger.log(`${drops.length} drops auto deactivated`);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async deleteDropById(id: number) {
    const drop = await this.dropsRepository.findOne({ where: { id: id } });
    if (!drop) {
      throw new NotFoundException('Drop not found');
    }
    await this.dropsRepository.delete(id);
    return drop;
  }
}
