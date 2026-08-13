import { Body, Controller, Get, Header, Post, Req } from '@nestjs/common';
import { TochkaPaymentService } from '../payment.service';
import { Request } from 'express';

@Controller('tochka')
export class TochkaController {
  constructor(private readonly tochkaPaymentService: TochkaPaymentService) {}

  @Post('webhook/acquiringInternetPayment')
  async handlePaymentStatus(@Req() req: Request) {
    const jwtToken = typeof req.body === 'string' ? req.body : String(req.body);
    return this.tochkaPaymentService.handlePaymentStatus(jwtToken);
  }

  @Get('customer-code')
  async getCustomerCode() {
    return this.tochkaPaymentService.getCustomerCode();
  }
}
