import { Module } from '@nestjs/common';
import { FilesController } from './presentation/controllers/files.controller';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [],
})
export class FilesModule {}
