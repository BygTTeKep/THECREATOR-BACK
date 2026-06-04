import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/modules/users/infrastructure/services/users.service';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { AuthUser } from 'src/core/decorators/authUser.decorator';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUserByIdResponseDto } from '../dtos/getUserById.dto';
import { AdminGuard } from 'src/core/guards/admin.guard';
import { GetUserDto, GetUserResponseDto } from '../dtos/getUser.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user',
    type: GetUserByIdResponseDto,
  })
  @Get('me')
  async me(@AuthUser() user: UserEntity) {
    await this.usersService.recalculateTiers([user]);
    return this.usersService.getUserById(user.id);
  }
  @ApiOperation({ summary: 'Get users by filter' })
  @ApiResponse({
    status: 200,
    type: [GetUserResponseDto],
  })
  @UseGuards(AdminGuard)
  @Post('filter')
  async getUsers(@Body() dto: GetUserDto) {
    return this.usersService.getUsersByFilter(dto);
  }
  @ApiOperation({})
  @UseGuards(AdminGuard)
  @Patch('update/:id')
  async updateUser(@Param('id') id: string, @Body() dto: Partial<UserEntity>) {
    return this.usersService.updateUser(id, dto);
  }
  @ApiOperation({})
  @UseGuards(AdminGuard)
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }
}
