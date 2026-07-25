import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DropLineEnum } from '../../domain/enums/dropLine.enum';
import { DropsTypeEnum } from '../../domain/enums/dropType.enum';
export class CreateDropRuleDto {
  @ApiProperty({ description: 'The minimum tier id' })
  @IsNotEmpty()
  @IsNumber()
  minTierId: number;

  @ApiProperty({ description: 'The whitelist only' })
  @IsBoolean()
  @IsNotEmpty()
  whitelistOnly: boolean;
}

export class CreateDropDto {
  @ApiProperty({ description: 'The name of the drop' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The description of the drop' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'The starts at of the drop' })
  @IsString()
  @IsOptional()
  starts_at: string;

  @ApiProperty({ description: 'The ends at of the drop' })
  @IsString()
  @IsOptional()
  ends_at: string;

  @ApiProperty({ description: 'The is active of the drop' })
  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;

  @ApiProperty({ description: 'The tier of the drop' })
  @IsNumber()
  @IsNotEmpty()
  tier: number;

  @ApiProperty({ description: 'The rule of the drop', type: CreateDropRuleDto })
  @ValidateNested()
  @Type(() => CreateDropRuleDto)
  @IsNotEmpty()
  rule: CreateDropRuleDto;

  @ApiProperty({ description: 'The file urls of the drop', type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  file_urls: string[];

  @ApiProperty({ description: 'The is visible of the drop' })
  @IsBoolean()
  @IsNotEmpty()
  is_visible: boolean;

  @ApiProperty({
    type: DropsTypeEnum,
    enumName: 'DropsTypeEnum',
    enum: DropsTypeEnum,
    example: DropsTypeEnum.preorder,
  })
  @IsEnum(DropsTypeEnum)
  @IsNotEmpty()
  drop_type: DropsTypeEnum;

  @IsEnum(DropLineEnum)
  @IsNotEmpty()
  drop_line: DropLineEnum;
}
