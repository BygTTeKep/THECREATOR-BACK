import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TiersEntity } from './domain/entities/tiers.entity';
import { TiersService } from './infrastructure/services/tiers.service';

@Module({
  imports: [TypeOrmModule.forFeature([TiersEntity])],
  providers: [TiersService],
  exports: [TiersService],
})
export class TiersModule {}
