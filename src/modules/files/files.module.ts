import { Module } from '@nestjs/common';
import { FilesController } from './presentation/controllers/files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesEntity } from './domain/entities/files.entity';
import { FilesService } from './infrastructure/services/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([FilesEntity])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
