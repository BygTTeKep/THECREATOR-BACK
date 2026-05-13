import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { IsNumber } from 'class-validator';
import { IsObject } from 'class-validator';
import { IsPositive } from 'class-validator';
import { IsArray } from 'class-validator';
import { ProductSizeEnum } from '../../domain/enums/productSize.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Drop ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  drop_id: number;

  @ApiProperty({
    description: 'Product name',
    example: 'Product 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product base cost',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  base_cost: number;

  @ApiProperty({
    description: 'Product metadata',
    example: { key: 'value' },
  })
  @IsObject()
  @IsNotEmpty()
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'Product files',
    example: ['/uploads/file1.jpg', '/uploads/file2.jpg'],
  })
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  files: string[];

  @ApiProperty({
    description: 'Product variants',
    example: [
      { size: ProductSizeEnum.S, price: 100, stock: 10, sku: '123456' },
      { size: ProductSizeEnum.M, price: 150, stock: 20, sku: '123457' },
    ],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'Product size',
    example: ProductSizeEnum.S,
  })
  @IsEnum(ProductSizeEnum)
  @IsNotEmpty()
  size: ProductSizeEnum;
  @ApiProperty({
    description: 'Product price',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;
  @ApiProperty({
    description: 'Product stock',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  stock: number;
  @ApiProperty({
    description: 'Product SKU',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;
}
