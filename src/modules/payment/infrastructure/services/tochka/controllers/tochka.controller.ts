import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TochkaPaymentService } from '../payment.service';
import { Request } from 'express';
import { CreatePaymentLinkDto } from '../dtos/createPaymentLink.dto';
import { PaymentFor } from 'src/modules/payment/domain/enums/paymentFor.enum';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('tochka')
export class TochkaController {
  constructor(private readonly tochkaPaymentService: TochkaPaymentService) {}

  @Post('webhook/acquiringInternetPayment')
  @HttpCode(200)
  async handlePaymentStatus(@Req() req: Request) {
    return this.tochkaPaymentService.handlePaymentStatus(
      this.extractJwt(req.body),
    );
  }

  private extractJwt(body: unknown): string {
    if (typeof body === 'string') {
      return body.trim();
    }
    if (Buffer.isBuffer(body)) {
      return body.toString('utf8').trim();
    }
    throw new BadRequestException('Webhook body must be a JWT string');
  }

  @ApiOperation({ summary: 'Create a payment link' })
  @ApiResponse({
    status: 201,
    description: 'Payment link created successfully',
  })
  @ApiBody({ type: CreatePaymentLinkDto })
  @ApiQuery({ name: 'paymentFor', enum: PaymentFor })
  @Post('create-payment-link')
  async createPaymentLink(
    @Body() body: CreatePaymentLinkDto,
    @Query('paymentFor') paymentFor: PaymentFor,
  ) {
    return this.tochkaPaymentService.createLinkToPayment(body, paymentFor);
  }
}
