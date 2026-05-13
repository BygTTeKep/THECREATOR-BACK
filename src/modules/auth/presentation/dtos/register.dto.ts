import { IsNotEmpty, IsString, IsPhoneNumber, IsEmail } from 'class-validator';

export class RegisterRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}
