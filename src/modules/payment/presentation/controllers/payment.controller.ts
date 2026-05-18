import { Body, Controller, Post } from '@nestjs/common';
import { GetEventsFromYKResponseDto } from '../../infrastructure/services/youkassa/dtos/getEventsFromYK.dto';
import { YoukassaPaymentService } from '../../infrastructure/services/youkassa/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly youkassaPaymentService: YoukassaPaymentService,
  ) {}

  @Post('youkassa')
  async createPayment(@Body() createPaymentDto: any) {
    return this.youkassaPaymentService.createPayment(createPaymentDto);
  }
  @Post('youkassa/subscription/notification_url')
  getEventsFromYKForSubscription(
    @Body() getEventsFromYKDto: GetEventsFromYKResponseDto,
  ) {
    return this.youkassaPaymentService.getStatusesForSubscription(
      getEventsFromYKDto,
    );
  }
  @Post('youkassa/order/notification_url')
  getEventsFromYKForOrder(
    @Body() getEventsFromYKDto: GetEventsFromYKResponseDto,
  ) {
    return this.youkassaPaymentService.getStatusesForOrder(getEventsFromYKDto);
  }
}
