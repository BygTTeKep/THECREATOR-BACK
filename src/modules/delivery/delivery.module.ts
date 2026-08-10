import { Module } from '@nestjs/common';
import { DeliveryController } from './presentation/controllers/delivery.controller';
import { SdekMapsController } from './presentation/controllers/sdek-maps.controller';
import { DeliveryService } from './infrastructure/services/delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryEntity } from './domain/entities/delivery.entity';
import { DeliveryCountryEntity } from './domain/entities/delivery-country.entity';
import { CountriesEntity } from './domain/entities/countries.entity';
import { HttpModule } from '@nestjs/axios';
import { SdekGetAccessTokenService } from './infrastructure/services/sdek/sdekGetAccessToken.service';
import { SdekService } from './infrastructure/services/sdek/sdek.service';
import { SdekMapsWidgetService } from './infrastructure/services/sdek/sdekMapsWidget.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryEntity,
      DeliveryCountryEntity,
      CountriesEntity,
    ]),
    HttpModule,
  ],
  controllers: [DeliveryController, SdekMapsController],
  providers: [
    DeliveryService,
    SdekGetAccessTokenService,
    SdekService,
    SdekMapsWidgetService,
  ],
  exports: [DeliveryService],
})
export class DeliveryModule {}
