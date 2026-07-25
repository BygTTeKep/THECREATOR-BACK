import { Injectable } from '@nestjs/common';
import { GetDropsResponseWithPageCountDto } from '../../presentation/dtos/getDrops.dto';
import { DropsFilesEntity } from '../../domain/entities/dropsFiles.entity';

@Injectable()
export class GetDropsMapper {
  toDto(
    drops: any[],
    dropFiles: DropsFilesEntity[],
    page_count: number,
  ): GetDropsResponseWithPageCountDto {
    return {
      page_count: page_count,
      drops: drops.map((drop: any) => ({
        id: drop.id,
        name: drop.name,
        description: drop.description,
        starts_at: drop.starts_at,
        ends_at: drop.ends_at,
        is_active: drop.is_active,
        tier: drop.tier,
        files: dropFiles.filter(
          (file: DropsFilesEntity) => file.drop_id === drop.id,
        ),
        drop_type: drop.drop_type,
        drop_line: drop.drop_line,
      })),
    };
  }
}
