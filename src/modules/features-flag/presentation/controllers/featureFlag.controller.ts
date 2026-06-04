import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeatureFlagService } from '../../infrastructure/services/featureFlag.service';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { CreateFeatureFlagDto } from '../dtos/createFeatureFlag.dto';
import { FeatureFlagEntity } from '../../domain/entities/featureFlag.entity';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from 'src/core/guards/admin.guard';
import { UpdateFeatureFlagDto } from '../dtos/updateFeatureFlag.dto';

@Controller('feature-flag')
export class FeatureFlagController {
  constructor(private readonly featureFlagService: FeatureFlagService) {}
  @Get('all')
  @ApiOperation({ summary: 'Get all feature flags' })
  @ApiResponse({
    status: 200,
    description: 'Returns all feature flags',
    type: [FeatureFlagEntity],
  })
  async getAllFeatureFlags() {
    return this.featureFlagService.getAllFeatureFlags();
  }
  @ApiOperation({ summary: 'Create a new feature flag' })
  @ApiBody({ type: CreateFeatureFlagDto })
  @ApiResponse({
    status: 201,
    description: 'Feature flag created successfully',
    type: FeatureFlagEntity,
  })
  @UseGuards(AuthGuard, AdminGuard)
  @Post('create')
  async createFeatureFlag(@Body() dto: CreateFeatureFlagDto) {
    return this.featureFlagService.createFeatureFlag(dto);
  }
  @UseGuards(AuthGuard, AdminGuard)
  @Put('update/:id')
  async updateFeatureFlag(
    @Body() dto: UpdateFeatureFlagDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.featureFlagService.updateFeatureFlag(id, dto);
  }
  @Get('get')
  async getFeatureFlagByName(@Query('name') name: string) {
    return this.featureFlagService.getFeatureFlagByName(name);
  }
  @Delete('delete/:id')
  async deleteFFById(@Param('id', ParseIntPipe) id: number) {
    return this.featureFlagService.deleteFFById(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Get(':id')
  async getFFById(@Param('id', ParseIntPipe) id: number) {
    return this.featureFlagService.getFFById(id);
  }
}
