import { Controller, Get, UseGuards } from '@nestjs/common';
import { DeliveryService } from '../../infrastructure/services/delivery.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AuthUser } from 'src/core/decorators/authUser.decorator';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';

@Controller('delivery')
@UseGuards(AuthGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}
  @Get('get-delivery-by-user-phone')
  async getDeliveryByUserPhone(@AuthUser() user: UserEntity) {
    return this.deliveryService.getDeliveryByUserPhone(user.phone);
  }
}
