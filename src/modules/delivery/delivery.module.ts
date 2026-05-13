import { Module } from '@nestjs/common';
import { DeliveryController } from './presentation/controllers/delivery.controller';
import { DeliveryService } from './infrastructure/services/delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryEntity } from './domain/entities/delivery.entity';
import { DeliveryCountryEntity } from './domain/entities/delivery-country.entity';
import { CountriesEntity } from './domain/entities/countries.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryEntity,
      DeliveryCountryEntity,
      CountriesEntity,
    ]),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
