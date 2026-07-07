import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialMediaEntity } from '../../domain/entities/socialmedia.entity';

@Injectable()
export class SocialMediaService {
  constructor(
    @InjectRepository(SocialMediaEntity)
    private readonly socRepo: Repository<SocialMediaEntity>,
  ) {}
  async getAll() {
    const result = await this.socRepo.find();
    return result;
  }
}
