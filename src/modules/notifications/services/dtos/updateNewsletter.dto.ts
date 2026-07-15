import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateNewsletterDto {
  @ApiProperty({
    type: Boolean,
    description: 'флаг о том что ему нужна рассылка',
  })
  @IsBoolean()
  @IsNotEmpty()
  @IsNotEmpty()
  @IsBoolean()
  enable: boolean;

  @ApiProperty({
    type: String,
    description: 'email пользователя',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    description: 'id сессии пользователя',
  })
  @IsNotEmpty()
  @IsString()
  session_id: string;
}
