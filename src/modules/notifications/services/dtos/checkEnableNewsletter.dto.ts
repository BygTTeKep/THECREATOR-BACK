import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CheckEnableNewsletterDto {
  @ApiProperty({
    type: String,
    description: 'id сессии пользователя',
  })
  @IsString()
  @IsNotEmpty()
  session_id: string;

  @ApiProperty({
    type: String,
    description: 'email пользователя',
  })
  @IsString()
  @IsOptional()
  email?: string;
}
