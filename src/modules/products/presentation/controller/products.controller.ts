import { ProductsService } from '../../infrastructure/services/products.service';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AdminGuard } from 'src/core/guards/admin.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AddVariantsToProductDto } from '../dtos/addVariantsToProduct.dto';
import { CreateProductValidation } from '../../infrastructure/validations/createProduct.validate';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: String,
  })
  @Post('create')
  @UseGuards(AdminGuard)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    CreateProductValidation.validate(createProductDto);
    return this.productsService.createProduct(createProductDto);
  }
  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(id);
  }
  @ApiOperation({ summary: 'Add variants to a product' })
  @ApiBody({ type: AddVariantsToProductDto })
  @ApiResponse({
    status: 201,
    description: 'Variants added successfully',
  })
  @Post('add-variants')
  @UseGuards(AdminGuard)
  async addVariantsToProduct(
    @Body() addVariantsToProductDto: AddVariantsToProductDto,
  ) {
    return this.productsService.addVariantsToProduct(addVariantsToProductDto);
  }
}
