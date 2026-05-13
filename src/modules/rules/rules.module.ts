import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropAccessRulesEntity } from './domain/entities/dropAccessRules.entity';
import { WhitelistEntity } from './domain/entities/whitelist.entity';
import { RulesService } from './infrastructure/services/rules.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { RulesController } from './presentation/controllers/rules.controller';
import { TiersModule } from '../tiers/tiers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DropAccessRulesEntity, WhitelistEntity]),
    SubscriptionsModule,
    TiersModule,
  ],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService],
})
export class RulesModule {}
