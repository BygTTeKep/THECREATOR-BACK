import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { IsArray } from 'class-validator';

export class AddVariantsToProductDto {
  @ApiProperty({ description: 'The product id' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'The variants' })
  @IsArray()
  @IsNotEmpty()
  variants: VariantsDto[];
}

export class VariantsDto {
  @ApiProperty({ description: 'The size' })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({ description: 'The price' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'The stock' })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({ description: 'The sku' })
  @IsString()
  @IsNotEmpty()
  sku: string;
}
