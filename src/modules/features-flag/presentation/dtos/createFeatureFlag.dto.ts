import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateFeatureFlagDto {
  @ApiProperty({ description: 'The name of the feature flag' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The description of the feature flag' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The is active of the feature flag' })
  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;
}
