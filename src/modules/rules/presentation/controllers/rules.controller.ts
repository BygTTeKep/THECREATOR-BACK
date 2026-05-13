import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { AdminGuard } from 'src/core/guards/admin.guard';
import { RulesService } from '../../infrastructure/services/rules.service';
import { CreateRuleForDropDto } from '../dtos/createRuleForDrop.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('rules')
@UseGuards(AuthGuard, AdminGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}
  @ApiOperation({ description: 'Create a rule for a drop' })
  @ApiBody({ type: CreateRuleForDropDto })
  @ApiResponse({
    status: 200,
    description: 'Rule created successfully',
    type: CreateRuleForDropDto,
  })
  @Post('create')
  async createRule(@Body() createRuleDto: CreateRuleForDropDto) {
    return this.rulesService.createRuleForDrop(createRuleDto);
  }
}
