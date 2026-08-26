import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DeliveryService } from '../../infrastructure/services/delivery.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AuthUser } from 'src/core/decorators/authUser.decorator';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('delivery')
@UseGuards(AuthGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}
  @Get('get-delivery-by-user-phone')
  async getDeliveryByUserPhone(@AuthUser() user: UserEntity) {
    return this.deliveryService.getDeliveryByUserPhone(user?.phone);
  }

  @ApiOperation({ summary: 'Get location by city name' })
  @ApiQuery({ name: 'cityName', type: String })
  @ApiResponse({ status: 200, description: 'Location by city name' })
  @Get('get-location-by-city-name')
  async getLocationByCityName(@Query('cityName') cityName: string) {
    return this.deliveryService.getLocationByCityName(cityName);
  }
}
