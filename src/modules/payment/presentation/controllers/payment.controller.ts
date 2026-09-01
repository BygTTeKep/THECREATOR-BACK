import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  GetAllPaymentsDto,
  GetAllPaymentsResponseDto,
} from './dtos/getAllPayments.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from '../../infrastructure/services/payments.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AdminGuard } from 'src/core/guards/admin.guard';

@Controller('payment')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // @Post('youkassa')
  // async createPayment(@Body() createPaymentDto: any) {
  //   return this.youkassaPaymentService.createPayment(createPaymentDto);
  // }
  // @Post('youkassa/subscription/notification_url')
  // getEventsFromYKForSubscription(
  //   @Body() getEventsFromYKDto: GetEventsFromYKResponseDto,
  // ) {
  //   return this.youkassaPaymentService.getStatusesForSubscription(
  //     getEventsFromYKDto,
  //   );
  // }
  // @Post('youkassa/order/notification_url')
  // getEventsFromYKForOrder(
  //   @Body() getEventsFromYKDto: GetEventsFromYKResponseDto,
  // ) {
  //   return this.youkassaPaymentService.getStatusesForOrder(getEventsFromYKDto);
  // }

  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, type: GetAllPaymentsResponseDto })
  @ApiBody({ type: GetAllPaymentsDto })
  @Post('all')
  @UseGuards(AdminGuard)
  async getAllPayments(@Body() getAllPaymentsDto: GetAllPaymentsDto) {
    return await this.paymentsService.getAllPayments(getAllPaymentsDto);
  }
}
