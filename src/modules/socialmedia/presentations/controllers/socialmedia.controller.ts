import { Controller, Get } from '@nestjs/common';
import { SocialMediaService } from '../../infrastructure/services/socialmedia.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('socialmedia')
export class SocialMediaController {
  constructor(private readonly socService: SocialMediaService) {}

  @ApiOperation({ summary: 'get all social media' })
  @Get()
  async getAll() {
    return this.socService.getAll();
  }
}
