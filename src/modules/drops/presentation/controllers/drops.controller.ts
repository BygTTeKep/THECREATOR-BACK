import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Param,
  Post,
  Put,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { DropsService } from '../../infrastructure/services/drops.service';
import { GetDropsDto, GetDropsResponseDto } from '../dtos/getDrops.dto';
import { CreateDropDto } from '../dtos/createDrop.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { AuthUser } from 'src/core/decorators/authUser.decorator';
import { AdminGuard } from 'src/core/guards/admin.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateDropDto } from '../dtos/updateDrop.dto';
import { GetDropByIdResponseDto } from '../dtos/getDropById.dto';

@Controller('drops')
@UseGuards(AuthGuard)
export class DropsController {
  constructor(private readonly dropsService: DropsService) {}

  @ApiOperation({ summary: 'Get all drops' })
  @ApiBody({ type: GetDropsDto })
  @ApiResponse({
    status: 200,
    description: 'Returns all drops',
    type: [GetDropsResponseDto],
  })
  @Post('all')
  async getAllDrops(
    @Body() getDropsDto: GetDropsDto,
    @AuthUser() user: UserEntity,
  ) {
    return this.dropsService.getAllDrops(getDropsDto, user);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get a drop by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a drop by ID',
    type: GetDropByIdResponseDto,
  })
  async getDropById(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: UserEntity,
  ) {
    return this.dropsService.getDropById(id, user);
  }
  @ApiOperation({ summary: 'Create a new drop with rule and files' })
  @ApiBody({ type: CreateDropDto })
  @ApiResponse({
    status: 200,
    description: 'Drop created successfully',
    type: CreateDropDto,
  })
  @Post()
  @UseGuards(AdminGuard)
  async createDrop(@Body() createDropDto: CreateDropDto) {
    return this.dropsService.createDrop(createDropDto);
  }
  @Put(':id')
  @UseGuards(AdminGuard)
  async updateDrop(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDropDto: UpdateDropDto,
  ) {
    return this.dropsService.updateDrop(id, updateDropDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteDropById(@Param('id', ParseIntPipe) id: number) {
    return this.dropsService.deleteDropById(id);
  }
}
