import { Injectable } from '@nestjs/common';
import {
  CreatePaymentRawDto,
  CreatePaymentYoukassaRequestDto,
} from '../dtos/createPayment.dto';

@Injectable()
export class CreatePaymentMapper {
  toYoukassaRequest(dto: CreatePaymentRawDto): CreatePaymentYoukassaRequestDto {
    return {
      amount: dto.amount,
      capture: true,
      confirmation: {
        type: 'redirect',
        confirmation_url: 'https://example.com/return_url', //TODO
      },
      description: dto.description,
    };
  }
}
