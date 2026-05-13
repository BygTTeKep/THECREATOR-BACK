import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureFlagEntity } from '../../domain/entities/featureFlag.entity';
import { Repository } from 'typeorm';
import { CreateFeatureFlagDto } from '../../presentation/dtos/createFeatureFlag.dto';
import { UpdateFeatureFlagDto } from '../../presentation/dtos/updateFeatureFlag.dto';

@Injectable()
export class FeatureFlagService {
  constructor(
    @InjectRepository(FeatureFlagEntity)
    private readonly featureFlagRepository: Repository<FeatureFlagEntity>,
  ) {}
  async getFeatureFlagByName(name: string): Promise<FeatureFlagEntity | null> {
    return this.featureFlagRepository.findOne({ where: { name } });
  }
  async createFeatureFlag(
    featureFlag: CreateFeatureFlagDto,
  ): Promise<FeatureFlagEntity> {
    return this.featureFlagRepository.save({
      name: featureFlag.name,
      description: featureFlag.description,
      is_active: featureFlag.is_active,
    });
  }
  async updateFeatureFlag(
    id: number,
    updateFeatureFlagDto: UpdateFeatureFlagDto,
  ): Promise<FeatureFlagEntity> {
    const featureFlag = await this.featureFlagRepository.findOne({
      where: { id },
    });
    if (!featureFlag) {
      throw new NotFoundException('Feature flag not found');
    }
    return this.featureFlagRepository.save({
      ...featureFlag,
      ...updateFeatureFlagDto,
    });
  }
  async isFeatureFlagActive(name: string): Promise<boolean> {
    const featureFlag = await this.getFeatureFlagByName(name);
    return featureFlag?.is_active ?? false;
  }
  async getAllFeatureFlags(): Promise<FeatureFlagEntity[]> {
    return this.featureFlagRepository.find();
  }
}
