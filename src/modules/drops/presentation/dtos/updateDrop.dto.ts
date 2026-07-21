import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DropsTypeEnum } from '../../domain/entities/dtops.entity';

export class UpdateDropDto {
  @ApiProperty({
    description: 'Drop name',
    example: 'Drop 1',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Drop description',
    example: 'Drop description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Drop starts at',
    example: '2026-01-01 00:00:00',
  })
  @IsString()
  @IsOptional()
  starts_at: string;

  @ApiProperty({
    description: 'Drop ends at',
    example: '2026-01-01 00:00:00',
  })
  @IsString()
  @IsOptional()
  ends_at: string;

  @ApiProperty({
    description: 'Drop is active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;

  @ApiProperty({
    description: 'Drop is visible',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  is_visible: boolean;

  @ApiProperty({
    description: 'Drop tier',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  tier: number;

  @ApiProperty({
    type: DropsTypeEnum,
    enumName: 'DropsTypeEnum',
    enum: DropsTypeEnum,
    example: DropsTypeEnum.preorder,
  })
  @IsEnum(DropsTypeEnum)
  @IsOptional()
  type: DropsTypeEnum;
}
