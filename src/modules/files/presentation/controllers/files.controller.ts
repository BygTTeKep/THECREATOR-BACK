import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AdminGuard } from 'src/core/guards/admin.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { diskStorage } from 'multer';
import { FilesService } from '../../infrastructure/services/files.service';
import { GetFileDto } from '../dtos/getFile.dto';

@Controller('files')
@UseGuards(AuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = randomUUID() + extname(file.originalname);
          cb(null, filename);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new BadRequestException('Only images allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @UseGuards(AdminGuard)
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files) {
      throw new BadRequestException('File is required');
    }
    const urls = files.map((file) => `/uploads/${file.filename}`);
    await this.filesService.createFiles(urls);
    return urls;
  }
  @Post('list')
  async getFiles(@Body() dto: GetFileDto) {
    return this.filesService.getFiles(dto);
  }
}
