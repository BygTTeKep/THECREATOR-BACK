import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';
import { TochkaPaymentStatus } from '../enums/paymentStatus.enum';

export class CreatePaymentLinkDto {
  /**
   * Уникальный код клиента
   * Возможные значения: 9 characters
   * Пример: 300000092
   */
  @IsNotEmpty()
  @IsString()
  @Length(9, 9)
  customerCode: string;
  /**
   * Сумма платежа
   * Возможные значения: > 0
   * Пример: 1234.00
   */
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  /**
   * Назначение платежа
   * Возможные значения: non-empty and <= 140 characters
   * Пример: Перевод за оказанные услуги
   */
  @IsNotEmpty()
  @IsString()
  purpose: string;

  /**
   * Способ оплаты
   * Возможные значения: [sbp, card, tinkoff, dolyame], >= 1
   * Пример: ["sbp","card","tinkoff","dolyame"]
   */
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  paymentMode: string[];

  /**
   * URL адрес, куда будет переправлен клиент после оплаты услуги
   * Возможные значения: non-empty and <= 2083 characters
   * Пример: https://example.com
   */
  @IsOptional()
  @IsString()
  redirectUrl?: string;

  /**
   * URL адрес, куда будет переправлен клиент в случае неуспешной оплаты
   * Возможные значения: non-empty and <= 2083 characters
   * Пример: https://example.com/fail
   */
  @IsOptional()
  @IsString()
  failRedirectUrl?: string;

  /**
   * Предложить покупателю сохранить карту
   * Пример: true
   */
  @IsOptional()
  @IsBoolean()
  saveCard?: boolean;
  /**
   * Идентификатор покупателя
   * Пример: fedac807-078d-45ac-a43b-5c01c57edbf8
   */
  @IsOptional()
  @IsString()
  @IsUUID()
  consumerId?: string;
  /**
   * Идентификатор торговой точки в интернет-эквайринге
   * Возможные значения: 15 characters
   * Пример: 200000000001056
   */
  @IsOptional()
  @IsString()
  @Length(15, 15)
  merchantId?: string;
  /**
   * Создать платёж с двухэтапной оплатой
   * Пример: true
   */
  @IsOptional()
  @IsBoolean()
  preAuthorization?: boolean;
  /**
   * Время жизни платёжной ссылки в минутах
   * Возможные значения: >= 1 and <= 44640
   * Значение по умолчанию: 10080
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(44640)
  ttl?: number;
  /**
   * Уникальный номер заказа
   * Возможные значения: non-empty and <= 45 characters
   */
  @IsOptional()
  @IsString()
  paymentLinkId?: string;
}

export class CreatePaymentLinkResponseDtoData {
  /**
   * Назначение платежа
   */
  @IsNotEmpty()
  @IsString()
  purpose: string;
  /**
   * Статус операции
   * Возможные значения: [CREATED, APPROVED, ON-REFUND, REFUNDED, EXPIRED, REFUNDED_PARTIALLY, AUTHORIZED, WAIT_FULL_PAYMENT]
   * Значение по умолчанию: CREATED
   * Пример: CREATED
   */
  @IsNotEmpty()
  @IsString()
  @IsEnum(TochkaPaymentStatus)
  status: TochkaPaymentStatus;
  /**
   * Сумма платежа
   */
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  /**
   * Идентификатор операции
   */
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  operationId: string;
  /**
   * Ссылка на платёжную страницу
   */
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  paymentLink: string;
  /**
   * Идентификатор покупателя
   */
  @IsOptional()
  @IsString()
  @IsUUID()
  consumerId: string;
  /**
   * Идентификатор торговой точки в интернет-эквайринге
   */
  @IsOptional()
  @IsString()
  @IsUUID()
  merchantId: string;
  /**
   * Создать платёж с двухэтапной оплатой
   * Пример: true
   */
  @IsOptional()
  @IsBoolean()
  preAuthorization: boolean;
  /**
   * Время жизни платёжной ссылки в минутах
   */
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(44640)
  ttl: number;

  /**
   * Уникальный номер заказа
   */
  @IsOptional()
  @IsString()
  paymentLinkId: string;
  /**
   * Способ оплаты
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  paymentMode: string[];
}

export class CreatePaymentLinkResponseDtoLinks {
  /**
   * Self
   * Возможные значения: non-empty and <= 2083 characters
   * Пример: https://enter.tochka.com/uapi
   */
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  self: string;
}

export class CreatePaymentLinkResponseDtoMeta {
  /**
   * Totalpages
   * Пример: 1
   */
  @IsNotEmpty()
  @IsNumber()
  totalPages: number;
}

export class CreatePaymentLinkResponseDto {
  Data: CreatePaymentLinkResponseDtoData;
  Links: CreatePaymentLinkResponseDtoLinks;
  Meta: CreatePaymentLinkResponseDtoMeta;
}
