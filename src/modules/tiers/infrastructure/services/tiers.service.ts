import { Injectable } from '@nestjs/common';
import { TiersEntity } from '../../domain/entities/tiers.entity';
import { LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TiersService {
  constructor(
    @InjectRepository(TiersEntity)
    private readonly tiersRepository: Repository<TiersEntity>,
  ) {}
  async getTiers(): Promise<TiersEntity[]> {
    return this.tiersRepository.find();
  }
  async getTiersByCode(code: string): Promise<TiersEntity | null> {
    return this.tiersRepository.findOne({ where: { code } });
  }
  async createTiers(tiers: TiersEntity): Promise<TiersEntity> {
    return this.tiersRepository.save(tiers);
  }
  async updateTiers(tiers: TiersEntity): Promise<TiersEntity> {
    return this.tiersRepository.save(tiers);
  }
  async getTierByMonths(months: number): Promise<TiersEntity | null> {
    return this.tiersRepository.findOne({
      where: { min_months: LessThanOrEqual(months) },
      order: { priority: 'DESC' },
    });
  }
  async getTierById(id: number): Promise<TiersEntity | null> {
    return await this.tiersRepository.findOne({ where: { id } });
  }
}
