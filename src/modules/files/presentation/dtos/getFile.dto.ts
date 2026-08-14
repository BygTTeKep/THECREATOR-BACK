import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from 'src/core/dtos/pagination.dto';
import { FilesEntity } from '../../domain/entities/files.entity';

export class GetFilterFilterDto {
  @ApiProperty({
    description: 'The name of the file',
    example: 'file',
  })
  @IsOptional()
  @IsString()
  name: string;
  @ApiProperty({
    description: 'The created at of the file',
    example: '2021-01-01',
  })
  @IsOptional()
  @IsDate()
  created_at: Date;
}

export class GetFileDto {
  @ApiProperty({
    description: 'The filters of the files',
    example: {
      name: 'file',
      created_at: '2021-01-01',
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GetFilterFilterDto)
  filters: GetFilterFilterDto;
  @ApiProperty({
    description: 'The pagination of the files',
    example: {
      page: 1,
      limit: 10,
    },
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}

export class GetFileResponseDto {
  @ApiProperty({
    description: 'The files of the files',
    example: [
      {
        id: 1,
        name: 'file',
        created_at: '2021-01-01',
      },
    ],
  })
  @IsArray()
  @ValidateNested()
  @Type(() => FilesEntity) //TODO: Create a DTO for the files
  files: FilesEntity[] = [];
  @ApiProperty({
    description: 'The total of the files',
    example: 10,
  })
  @IsNumber()
  total: number;
  @ApiProperty({
    description: 'The page of the files',
    example: 1,
  })
  @IsNumber()
  page: number;
  @ApiProperty({
    description: 'The limit of the files',
    example: 10,
  })
  @IsNumber()
  limit: number;
}
