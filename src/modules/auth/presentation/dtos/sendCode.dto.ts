import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для отправки кода верификации
 * @example
 * {
 *   "phone": "+79999999999"
 * }
 */
export class SendCodeRequestDto {
  @IsString()
  @IsNotEmpty()
  phone: string;
}
