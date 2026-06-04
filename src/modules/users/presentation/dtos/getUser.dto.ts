import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { UserStatus } from '../../domain/enums/userStatus.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserFilterDto {
  @IsEmail({}, { each: true })
  @IsOptional()
  emails: string[];

  @IsString({ each: true })
  @IsOptional()
  phones: string[];

  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;
}

export class GetUserDto {
  @ValidateNested()
  @Type(() => PaginationDto)
  @IsNotEmpty()
  pagination: PaginationDto;

  @ValidateNested()
  @Type(() => GetUserFilterDto)
  @IsNotEmpty()
  filters: GetUserFilterDto;
}

export class GetUserResponseDto {
  @ApiProperty({ type: String })
  id: string;
  @ApiProperty({ type: String })
  email: string;
  @ApiProperty({ type: String })
  phone: string;
  @ApiProperty({ type: String })
  status: string;
  @ApiProperty({ type: Number })
  total_months: number;
  @ApiProperty({ type: String })
  created_at: string;
  @ApiProperty({ type: Number })
  current_tier_id?: number | null;
}
