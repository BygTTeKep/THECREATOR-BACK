import { CreateOrderDto } from '../../presentation/dtos/createOrder.dto';
import { Injectable } from '@nestjs/common';
import { ProductsEntity } from 'src/modules/products/domain/entities/product.entity';
import { GetProductVariantsOrmDto } from 'src/modules/products/infrastructure/dtos/getProductVariantsOrm.dto';

export class CreateOrderItemDto {
  product_id: string;
  quantity: number;
  order_id: string;
  price: number;
}

@Injectable()
export class CreateOrderMapper {
  toDto(
    createOrderDto: CreateOrderDto,
    orderId: string,
    products: ProductsEntity[],
    productVariants: GetProductVariantsOrmDto[],
  ): CreateOrderItemDto[] {
    const product = createOrderDto.products.map((item) => {
      const product = products.find(
        (product) => product.id === item.product_id,
      );
      if (!product) {
        return null;
      }
      return {
        product_id: item.product_id,
        quantity: item.quantity,
        order_id: orderId,
        price:
          productVariants.find(
            (variant) => variant.product_id === item.product_id,
          )?.price || 0,
      };
    });
    return product.filter((item) => item !== null);
  }
}
