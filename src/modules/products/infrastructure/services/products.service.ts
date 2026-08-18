import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, MoreThan, Repository } from 'typeorm';
import { ProductsEntity } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../../presentation/dtos/createProduct.dto';
import { GetProductMapper } from '../mappers/getProduct.mapper';
import { ProductFilesEntity } from '../../domain/entities/productFiles.entity';
import { ProductVariantsEntity } from '../../domain/entities/productVariants.entity';
import { GetProductResponseDto } from '../../presentation/dtos/getProductResponse.dto';
import { GetProductOrmDto } from '../dtos/getProductOrm.dto';
import { AddVariantsToProductDto } from '../../presentation/dtos/addVariantsToProduct.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
    private readonly getProductMapper: GetProductMapper,
    @InjectRepository(ProductFilesEntity)
    private readonly productFilesRepository: Repository<ProductFilesEntity>,
    @InjectRepository(ProductVariantsEntity)
    private readonly productVariantsRepository: Repository<ProductVariantsEntity>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<string> {
    const newProduct = await this.productsRepository.manager.transaction(async (transactionalEntityManager) => {
      const product = transactionalEntityManager.create(ProductsEntity, createProductDto);
      const newProduct = await transactionalEntityManager.save(ProductsEntity, product);
      if (createProductDto.files.length > 0) {
        const productFiles = createProductDto.files.map((file) =>
          transactionalEntityManager.create(ProductFilesEntity, {
            product_id: newProduct.id,
            file_url: file,
          }),
        );
        await transactionalEntityManager.save(ProductFilesEntity, productFiles);
      }
      if (createProductDto.variants.length > 0) {
        const productVariants = createProductDto.variants.map((variant) =>
          transactionalEntityManager.create(ProductVariantsEntity, {
            product_id: newProduct.id,
            size: variant.size,
            price: variant.price,
            stock: variant.stock,
            sku: variant.sku,
          }),
        );
        await transactionalEntityManager.save(ProductVariantsEntity, productVariants);
      }
      return newProduct;
    });
    
    return newProduct?.id ?? '';
  }
  async getProductById(id: string): Promise<ProductsEntity> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
  async getProductsByDropId(dropId: number): Promise<GetProductResponseDto[]> {
    const products = await this.productsRepository.find({
      where: { drop_id: dropId },
    });
    const productFiles = await this.productFilesRepository.find({
      where: { product_id: In(products.map((product) => product.id)) },
    });
    const productVariants = await this.productVariantsRepository.find({
      where: {
        product_id: In(products.map((product) => product.id)),
        stock: MoreThan(0),
      },
    });
    return products.map((product) =>
      this.getProductMapper.toDto(
        product as GetProductOrmDto,
        productFiles,
        productVariants,
      ),
    );
  }
  async getProductsByDropIdAndProductIds(
    dropId: number,
    productIds: string[],
  ): Promise<ProductsEntity[]> {
    const products = await this.productsRepository.find({
      where: { drop_id: dropId, id: In(productIds) },
    });
    return products;
  }
  async getProductVariantsByProductIds(
    productIds: string[],
  ): Promise<ProductVariantsEntity[]> {
    return this.productVariantsRepository.find({
      where: { product_id: In(productIds) },
    });
  }
  async getProductVariantsByIds(
    ids: string[],
  ): Promise<ProductVariantsEntity[]> {
    return this.productVariantsRepository.find({
      where: { id: In(ids) },
    });
  }

  async recalculateStock(
    transactionalEntityManager: EntityManager,
    productVariantsIds: string[],
    quantity: number,
  ): Promise<void> {
    for (const productVariantId of productVariantsIds) {
      const productVariant = await transactionalEntityManager.findOne(
        ProductVariantsEntity,
        {
          where: { id: productVariantId },
        },
      );
      if (!productVariant) {
        continue;
      }
      if (productVariant.stock < quantity) {
        throw new BadRequestException('Not enough stock');
      }
      productVariant.stock -= quantity;
      await transactionalEntityManager.save(
        ProductVariantsEntity,
        productVariant,
      );
    }
  }
  async addVariantsToProduct(dto: AddVariantsToProductDto): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id: dto.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const existingProductVariants = await this.productVariantsRepository.find({
      where: { product_id: dto.productId },
    });

    // Ищем новые варианты
    const newProductVariants = dto.variants.filter(
      (variant) =>
        !existingProductVariants.some(
          (existingVariant) => existingVariant.sku === variant.sku,
        ),
    );

    // Ищем существующие варианты
    const productVariantsToUpdate = existingProductVariants.filter((variant) =>
      dto.variants.some((v) => v.sku === variant.sku),
    );
    if (productVariantsToUpdate.length > 0) {
      for (const variant of productVariantsToUpdate) {
        const existingVariant = existingProductVariants.find(
          (v) => v.sku === variant.sku,
        );
        // Прибавляем к существующему варианту количество из dto
        if (existingVariant) {
          existingVariant.stock +=
            dto.variants.find((v) => v.sku === variant.sku)?.stock ?? 0;
          await this.productVariantsRepository.save(existingVariant);
        }
      }
    }

    const productVariantsToCreate = newProductVariants.map((variant) =>
      this.productVariantsRepository.create({
        product_id: dto.productId,
        size: variant.size,
        price: variant.price,
        stock: variant.stock,
        sku: variant.sku,
      }),
    );
    await this.productVariantsRepository.save(productVariantsToCreate);
  }

  async getProductsByIds(ids: number[]): Promise<ProductsEntity[]> {
    return this.productsRepository.find({
      where: { drop_id: In(ids) },
    });
  }
  async getProductsPriceByDropIds(
    dropIds: number[],
  ): Promise<{ id: string; prices: ProductVariantsEntity[] }[]> {
    const products = await this.productsRepository.find({
      where: { drop_id: In(dropIds) },
    });
    const productVariants = await this.productVariantsRepository.find({
      where: { product_id: In(products.map((product) => product.id)) },
    });
    const response = products.map((product) => {
      return {
        id: product.id,
        prices: productVariants.filter((variant) => variant.product_id === product.id),
      };
    });
    return response;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }
}
