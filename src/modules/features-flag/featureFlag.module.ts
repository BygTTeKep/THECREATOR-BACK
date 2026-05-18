import { Module } from '@nestjs/common';
import { FeatureFlagController } from './presentation/controllers/featureFlag.controller';
import { FeatureFlagService } from './infrastructure/services/featureFlag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureFlagEntity } from './domain/entities/featureFlag.entity';
@Module({
  imports: [TypeOrmModule.forFeature([FeatureFlagEntity])],
  controllers: [FeatureFlagController],
  providers: [FeatureFlagService],
  exports: [FeatureFlagService],
})
export class FeatureFlagModule {}
