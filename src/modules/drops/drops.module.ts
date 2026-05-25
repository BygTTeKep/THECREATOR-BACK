import { Module } from '@nestjs/common';
import { DropsService } from './infrastructure/services/drops.service';
import { DropsController } from './presentation/controllers/drops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropsEntity } from './domain/entities/dtops.entity';
import { GetDropByIdMapper } from './infrastructure/mappers/getDropById.mapper';
import { RulesModule } from '../rules/rules.module';
import { ProductsEntity } from '../products/domain/entities/product.entity';
import { DropsFilesEntity } from './domain/entities/dropsFiles.entity';
import { GetDropsMapper } from './infrastructure/mappers/getDrops.mapper';
import { ProductFilesEntity } from '../products/domain/entities/productFiles.entity';
import { ProductsModule } from '../products/products.module';
import { TiersModule } from '../tiers/tiers.module';
import { AutoDeactivateDropCron } from './presentation/crons/autoDeactivateDrop.cron';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DropsEntity,
      ProductsEntity,
      DropsFilesEntity,
      ProductFilesEntity,
    ]),
    RulesModule,
    ProductsModule,
    TiersModule,
  ],
  providers: [
    DropsService,
    GetDropByIdMapper,
    GetDropsMapper,
    AutoDeactivateDropCron,
  ],
  controllers: [DropsController],
})
export class DropsModule {}
