import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateFeatureFlagDto {
  @ApiProperty({ description: 'The name of the feature flag' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'The description of the feature flag' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'The is active of the feature flag' })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}
