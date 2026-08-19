import { Injectable } from '@nestjs/common';
import { GetProductOrmDto } from '../dtos/getProductOrm.dto';
import { GetProductFilesOrmDto } from '../dtos/getProductFilesOrm.dto';
import { GetProductResponseDto } from '../../presentation/dtos/getProductResponse.dto';
import { GetProductVariantsOrmDto } from '../dtos/getProductVariantsOrm.dto';
import { ProductSizeDescriptionEnum } from '../../domain/enums/productSize.enum';

@Injectable()
export class GetProductMapper {
  toDto(
    product: GetProductOrmDto,
    productFiles: GetProductFilesOrmDto[],
    productVariants: GetProductVariantsOrmDto[],
  ): GetProductResponseDto {
    const productFilesDto = productFiles
      .filter((file) => file.product_id === product.id)
      .map((file) => ({
        id: file.id,
        file_url: file.file_url,
      }));
    const productVariantsDto = productVariants
      .filter((variant) => variant.product_id === product.id)
      .map((variant) => ({
        id: variant.id,
        size: ProductSizeDescriptionEnum[variant.size],
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
      }));
    return {
      id: product.id,
      drop_id: product.drop_id,
      name: product.name,
      base_cost: product.base_cost,
      metadata: product.metadata,
      created_at: product.created_at,
      files: productFilesDto,
      variants: productVariantsDto,
    };
  }
}
