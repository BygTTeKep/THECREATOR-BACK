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
  IsEnum,
  IsOptional,
} from 'class-validator';
import { DeliveryTypeEnum } from 'src/modules/delivery/domain/enums/deliveryType.enum';
import { OrdersTypeEnum } from '../../domain/enums/ordersType.enum';
import { PaymentTypeEnum } from 'src/core/enums/paymentType.enum';

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

  @ApiProperty({ description: 'position coordinates' })
  @IsOptional()
  position?: string[]

  @ApiProperty({ description: 'postal code' })
  @IsOptional()
  @IsString()
  postal_code?: string;

  @ApiProperty({ description: 'address formatted' })
  @IsOptional()
  @IsString()
  formatted?: string;
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
  @ApiProperty({ description: 'The delivery method of the order' })
  @IsString()
  @IsNotEmpty()
  deliveryMethod: string;

  @ApiProperty({
    description: 'Тип доставки до двери или пвз',
    example: DeliveryTypeEnum.pvz,
    enum: DeliveryTypeEnum,
  })
  @IsEnum(DeliveryTypeEnum)
  @IsNotEmpty()
  delivery_type: DeliveryTypeEnum;

  @ApiProperty({
    type: OrdersTypeEnum,
    enumName: 'OrdersTypeEnum',
    enum: OrdersTypeEnum,
    example: OrdersTypeEnum.preorder,
  })
  @IsEnum(OrdersTypeEnum)
  @IsNotEmpty()
  order_type: OrdersTypeEnum;

  @ApiProperty({
    type: PaymentTypeEnum,
    enumName: 'PaymentTypeEnum',
    enum: PaymentTypeEnum,
    example: PaymentTypeEnum.now,
  })
  @IsEnum(PaymentTypeEnum)
  payment_type: PaymentTypeEnum;
}
