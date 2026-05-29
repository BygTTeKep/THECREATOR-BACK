import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class VerifyPhoneAndEmailRequestDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
