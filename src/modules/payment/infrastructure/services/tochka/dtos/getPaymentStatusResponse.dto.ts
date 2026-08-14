import { TochkaPaymentStatus } from '../enums/paymentStatus.enum';

export class GetPaymentStatusTochkaResponseDto {
  operationId: string;
  status: TochkaPaymentStatus;
  amount: number;
}
