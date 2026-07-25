import { ApiProperty } from '@nestjs/swagger';
import { GetProductResponseDto } from 'src/modules/products/presentation/dtos/getProductResponse.dto';
import { DropLineEnum } from '../../domain/enums/dropLine.enum';
import { DropsTypeEnum } from '../../domain/enums/dropType.enum';
export class GetDropFileResponseDto {
  @ApiProperty({ description: 'The ID of the file' })
  id: number;
  @ApiProperty({ description: 'The file url of the file' })
  file_url: string;
}

export class GetDropByIdResponseDto {
  @ApiProperty({ description: 'The ID of the drop' })
  id: number;
  @ApiProperty({ description: 'The name of the drop' })
  name: string;
  @ApiProperty({ description: 'The description of the drop' })
  description: string;
  @ApiProperty({ description: 'The starts at of the drop' })
  starts_at: Date;
  @ApiProperty({ description: 'The ends at of the drop' })
  ends_at: Date;
  @ApiProperty({ description: 'The is active of the drop' })
  is_active: boolean;
  @ApiProperty({ description: 'The tier of the drop' })
  tier: number;
  @ApiProperty({ description: 'The can buy of the drop' })
  can_buy: boolean;
  @ApiProperty({
    description: 'The products of the drop',
    type: [GetProductResponseDto],
  })
  products: GetProductResponseDto[];
  @ApiProperty({
    description: 'The files of the drop',
    type: [GetDropFileResponseDto],
  })
  files: GetDropFileResponseDto[];

  @ApiProperty({
    type: DropsTypeEnum,
    enumName: 'DropsTypeEnum',
    enum: DropsTypeEnum,
    example: DropsTypeEnum.preorder,
  })
  drop_type: DropsTypeEnum;

  @ApiProperty({
    type: DropLineEnum,
    enumName: 'DropLineEnum',
    enum: DropLineEnum,
    example: DropLineEnum.limit,
  })
  drop_line: DropLineEnum;
}
