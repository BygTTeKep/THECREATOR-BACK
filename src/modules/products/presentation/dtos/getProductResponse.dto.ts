import { ApiProperty } from '@nestjs/swagger';

export class GetProductFilesResponseDto {
  @ApiProperty({ description: 'The ID of the file' })
  id: string;
  @ApiProperty({ description: 'The file url of the file' })
  file_url: string;
}

export class GetProductVariantsResponseDto {
  @ApiProperty({ description: 'The ID of the variant' })
  id: string;
  @ApiProperty({ description: 'The size of the variant' })
  size: string;
  @ApiProperty({ description: 'The SKU of the variant' })
  sku: string;
  @ApiProperty({ description: 'The price of the variant' })
  price: number;
  @ApiProperty({ description: 'The stock of the variant' })
  stock: number;
}

export class GetProductResponseDto {
  @ApiProperty({ description: 'The ID of the product' })
  id: string;
  @ApiProperty({ description: 'The drop ID of the product' })
  drop_id: number;
  @ApiProperty({ description: 'The name of the product' })
  name: string;
  @ApiProperty({ description: 'The base cost of the product' })
  base_cost: number;
  @ApiProperty({ description: 'The metadata of the product' })
  metadata: Record<string, any>;
  @ApiProperty({ description: 'The created at of the product' })
  created_at: Date;
  @ApiProperty({
    description: 'The files of the product',
    type: [GetProductFilesResponseDto],
  })
  files: GetProductFilesResponseDto[];
  @ApiProperty({
    description: 'The variants of the product',
    type: [GetProductVariantsResponseDto],
  })
  variants: GetProductVariantsResponseDto[];
}
