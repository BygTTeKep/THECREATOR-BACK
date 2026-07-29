import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/createUser.dto';
import { CreateUserRequestDto } from '../../presentation/dtos/createUser.dto';
import { UserStatus } from 'src/modules/users/domain/enums/userStatus.enum';

@Injectable()
export class CreateUserMapper {
  toDto(dto: CreateUserRequestDto): CreateUserDto {
    return {
      email: dto.email,
      phone: dto.phone,
      status: UserStatus.ACTIVE,
      total_months: 0,
      metadata: {},
      created_at: new Date(),
      current_tier_id: 1,
      subscription_id: null,
    };
  }
}
