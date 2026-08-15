import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { TochkaPaymentService } from '../payment.service';
import { Request } from 'express';

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
}
