import { GetDropByIdResponseDto } from '../../presentation/dtos/getDropById.dto';
import { DropsEntity } from 'src/modules/drops/domain/entities/dtops.entity';
import { DropsFilesEntity } from '../../domain/entities/dropsFiles.entity';
import { GetProductResponseDto } from 'src/modules/products/presentation/dtos/getProductResponse.dto';

export class GetDropByIdMapper {
  toDto(
    drop: DropsEntity,
    products: GetProductResponseDto[],
    canBuy: boolean,
    files: DropsFilesEntity[],
  ): GetDropByIdResponseDto {
    return {
      id: drop.id,
      name: drop.name,
      description: drop.description,
      starts_at: drop.starts_at,
      ends_at: drop.ends_at,
      is_active: drop.is_active,
      tier: drop.tier,
      can_buy: canBuy,
      files: files.map((file) => ({
        id: file.id,
        file_url: file.file_url,
      })),
      products: products,
    };
  }
}
