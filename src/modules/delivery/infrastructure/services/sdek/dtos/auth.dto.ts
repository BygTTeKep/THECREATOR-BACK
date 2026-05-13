import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AuthResponseDto {
  @IsString()
  @IsNotEmpty()
  access_token: string;
  @IsString()
  @IsNotEmpty()
  token_type: string;
  @IsNumber()
  @IsNotEmpty()
  expires_in: number;
  @IsString()
  @IsNotEmpty()
  scope: string;
  @IsString()
  @IsNotEmpty()
  jti: string;
}
export class AuthErrorResponseDto {
  @IsString()
  @IsNotEmpty()
  error: string;
  @IsString()
  @IsNotEmpty()
  error_description: string;
}
