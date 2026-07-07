import { Module } from '@nestjs/common';
import { SocialMediaService } from './infrastructure/services/socialmedia.service';
import { SocialMediaController } from './presentations/controllers/socialmedia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialMediaEntity } from './domain/entities/socialmedia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialMediaEntity])],
  providers: [SocialMediaService],
  controllers: [SocialMediaController],
})
export class SocialMediaModule {}
