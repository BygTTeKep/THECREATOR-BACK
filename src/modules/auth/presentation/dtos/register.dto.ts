import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsPhoneNumber,
  IsEmail,
  MinLength,
} from 'class-validator';

/**
 * DTO для регистрации
 * @example
 * {
 *   "phone": "+79999999999",
 *   "email": "test@example.com",
 *   "password": "secret"
 * }
 */
export class RegisterRequestDto {
  @ApiProperty({
    description: 'Phone number',
    example: '+79999999999',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'Email',
    example: 'test@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'secret',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
