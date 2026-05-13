import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/modules/users/infrastructure/services/users.service';
import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { AuthUser } from 'src/core/decorators/authUser.decorator';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUserByIdResponseDto } from '../dtos/getUserById.dto';

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
    // TODO: добавить маппер для преобразования UserEntity в UserResponseDto
    await this.usersService.recalculateTiers([user]);
    return this.usersService.getUserById(user.id);
  }
}
