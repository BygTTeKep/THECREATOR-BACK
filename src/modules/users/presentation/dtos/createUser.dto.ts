import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO для создания пользователя
 * @example
 * {
 *   "email": "test@example.com",
 *   "phone": "+79999999999",
 *   "verificationCode": "123456"
 * }
 */
export class CreateUserRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}
