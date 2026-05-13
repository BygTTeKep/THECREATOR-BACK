import { Injectable } from '@nestjs/common';
import { GetProductOrmDto } from '../dtos/getProductOrm.dto';
import { GetProductFilesOrmDto } from '../dtos/getProductFilesOrm.dto';
import { GetProductResponseDto } from '../../presentation/dtos/getProductResponse.dto';
import { GetProductVariantsOrmDto } from '../dtos/getProductVariantsOrm.dto';

@Injectable()
export class GetProductMapper {
  toDto(
    product: GetProductOrmDto,
    productFiles: GetProductFilesOrmDto[],
    productVariants: GetProductVariantsOrmDto[],
  ): GetProductResponseDto {
    return {
      id: product.id,
      drop_id: product.drop_id,
      name: product.name,
      base_cost: product.base_cost,
      metadata: product.metadata,
      created_at: product.created_at,
      files: productFiles.map((file) => ({
        id: file.id,
        file_url: file.file_url,
      })),
      variants: productVariants.map((variant) => ({
        id: variant.id,
        size: variant.size,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
      })),
    };
  }
}
