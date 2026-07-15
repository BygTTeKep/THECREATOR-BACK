import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddToNewsletterDto {
  @ApiProperty({
    type: Boolean,
    description: 'флаг о том что ему нужна рассылка',
  })
  @IsBoolean()
  @IsNotEmpty()
  enable: boolean;

  @ApiProperty({
    type: String,
    description: 'id сессии пользователя',
  })
  @IsString()
  @IsNotEmpty()
  user_session_id: string;

  @ApiProperty({
    type: String,
    description: 'email пользователя',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
