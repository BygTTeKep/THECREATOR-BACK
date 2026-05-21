import { OrdersService } from '../../infrastructure/services/orders.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from '../dtos/createOrder.dto';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AuthUser } from 'src/core/decorators/authUser.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetOrdersDto, GetOrdersResponseDto } from '../dtos/getOrders.dto';

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
}
