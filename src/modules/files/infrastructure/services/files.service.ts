import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilesEntity } from '../../domain/entities/files.entity';
import { Injectable } from '@nestjs/common';
import { GetFileDto, GetFileResponseDto } from '../../presentation/dtos/getFile.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepository: Repository<FilesEntity>,
  ) {}

  async createFiles(urls: string[]) {
    const files = urls.map((url) => this.filesRepository.create({ url }));
    return await this.filesRepository.save(files);
  }
  async getFiles(dto: GetFileDto): Promise<GetFileResponseDto> {
    const { filters, pagination } = dto;
    const queryBuilder = this.filesRepository.createQueryBuilder('files');
    if (filters?.name) {
      queryBuilder.andWhere('files.name = :name', { name: filters.name });
    }
    if (filters?.created_at) {
      queryBuilder.andWhere('files.created_at = :created_at', {
        created_at: filters.created_at,
      });
    }
    queryBuilder.orderBy('files.created_at', 'DESC');
    queryBuilder.skip((pagination.page - 1) * pagination.limit);
    queryBuilder.take(pagination.limit);
    const [files, total] = await queryBuilder.getManyAndCount();
    return {
      files,
      total,
      page: pagination.page,
      limit: pagination.limit,
    };
  }
}
