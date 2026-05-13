import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateOrderProductDto {
  @ApiProperty({ description: 'The ID of the product' })
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({ description: 'The quantity of the product', example: 1 })
  @IsPositive()
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'The ID of the product variant' })
  @IsString()
  @IsNotEmpty()
  variant_id: string;
}

export class ShippingAddressDto {
  @ApiProperty({ description: 'The country of the user' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'The city of the user' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'The street of the user' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'The house number of the user' })
  @IsString()
  @IsNotEmpty()
  house: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'The ID of the drop' })
  @IsNumber()
  @IsNotEmpty()
  dropId: number;

  @ApiProperty({
    description: 'The products in the order',
    type: [CreateOrderProductDto],
  })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];

  @ApiProperty({ description: 'The full name of the user' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'The shipping address of the user',
    type: ShippingAddressDto,
  })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;
}
