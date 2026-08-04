import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO для создания пользователя
 * @example
 * {
 *   "email": "test@example.com",
 *   "phone": "+79999999999",
 *   "password": "secret"
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
  @MinLength(6)
  password: string;
}
