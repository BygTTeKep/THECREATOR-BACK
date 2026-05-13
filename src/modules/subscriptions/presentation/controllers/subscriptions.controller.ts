import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/core/decorators/authUser.decorator';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { SubscriptionsService } from '../../infrastructure/services/subscriptions.service';
import { GetPlansResponseDto } from '../dtos/getPlans.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSubscriptionDto } from '../dtos/createSubscription.dto';

@Controller('subscriptions')
@UseGuards(AuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get()
  async getSubscriptions(@AuthUser() user: UserEntity) {
    return this.subscriptionsService.getSubscriptionByUserId(user.id);
  }
  @Post('cancel')
  async cancelSubscription(@AuthUser() user: UserEntity) {
    return this.subscriptionsService.cancelSubscription(user.id);
  }
  @ApiOperation({ summary: 'Update a subscription' })
  @ApiResponse({
    status: 200,
    description: 'Subscription updated successfully',
  })
  @Post('update')
  async updateSubscription(
    @AuthUser() user: UserEntity,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createSubscription(
      user.id,
      createSubscriptionDto,
    );
  }

  @ApiOperation({ summary: 'Create a new subscription' })
  @ApiResponse({
    status: 201,
    description: 'Subscription created successfully',
  })
  @Post('create')
  async createSubscription(
    @AuthUser() user: UserEntity,
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.subscriptionsService.createSubscription(
      user.id,
      createSubscriptionDto,
    );
  }

  @ApiOperation({ summary: 'Get all plans' })
  @ApiResponse({
    status: 200,
    description: 'Returns all plans',
    type: [GetPlansResponseDto],
  })
  @Get('plans')
  async getAllSubscriptions(@AuthUser() user: UserEntity) {
    return this.subscriptionsService.getPlans(user.id);
  }
}
