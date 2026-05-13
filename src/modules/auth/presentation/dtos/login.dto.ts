/**
 * DTO для логина
 * @example
 * {
 *   "phone": "+79999999999",
 *   "verificationCode": "123456"
 * }
 */

import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: string;

  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}
