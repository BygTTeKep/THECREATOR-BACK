/**
 * DTO для логина
 * @example
 * {
 *   "phone": "+79999999999",
 *   "password": "secret"
 * }
 */

import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Phone number',
    example: '+79999999999',
  })
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({
    description: 'Password',
    example: 'secret',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
