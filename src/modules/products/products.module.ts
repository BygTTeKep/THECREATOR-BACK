import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsEntity } from './domain/entities/product.entity';
import { ProductsService } from './infrastructure/services/products.service';
import { ProductsController } from './presentation/controller/products.controller';
import { ProductFilesEntity } from './domain/entities/productFiles.entity';
import { GetProductMapper } from './infrastructure/mappers/getProduct.mapper';
import { ProductVariantsEntity } from './domain/entities/productVariants.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsEntity,
      ProductFilesEntity,
      ProductVariantsEntity,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, GetProductMapper],
  exports: [ProductsService],
})
export class ProductsModule {}
