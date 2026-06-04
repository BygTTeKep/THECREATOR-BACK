import { OrdersService } from '../../infrastructure/services/orders.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from '../dtos/createOrder.dto';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AuthUser } from 'src/core/decorators/authUser.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetOrdersDto, GetOrdersResponseDto } from '../dtos/getOrders.dto';
import { AdminGuard } from 'src/core/guards/admin.guard';
import { GetOrdersAdminDto } from '../dtos/getOrderForAdmin.dto';
import { UpdateOrderDto } from '../dtos/updateOrder.dto';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: String,
  })
  @Post()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.ordersService.createOrder(createOrderDto, user);
  }

  @ApiOperation({ summary: 'Get all orders by user id' })
  @ApiBody({ type: GetOrdersDto })
  @ApiResponse({
    status: 200,
    description: 'Returns all orders by user id',
    type: [GetOrdersResponseDto],
  })
  @Post('my')
  async getOrders(
    @Body() getOrdersDto: GetOrdersDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.ordersService.getOrdersByUserId(getOrdersDto, user.id);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all orders by admin' })
  @ApiBody({ type: GetOrdersAdminDto })
  @ApiResponse({
    status: 200,
    description: 'Returns all orders by admin',
    type: [GetOrdersResponseDto],
  })
  @Post('get-orders')
  async getOrdersAdmin(@Body() dto: GetOrdersAdminDto) {
    return this.ordersService.getOrdersAdmin(dto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'update order status or tracking number by id',
  })
  @ApiBody({ type: UpdateOrderDto })
  @Patch(':id')
  async updateOrderById(@Param('id') id: string, @Body() dto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id, dto);
  }

  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'get order by id',
  })
  @ApiResponse({ type: GetOrdersResponseDto })
  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    return this.ordersService.getOrdersAdminDetails(id);
  }
}
