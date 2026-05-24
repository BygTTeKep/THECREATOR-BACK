import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { GetUserByIdResponseDto } from '../../presentation/dtos/getUserById.dto';

@Injectable()
export class GetUserByIdMapper {
  toDto(
    user: UserEntity,
    haveActiveSubscription: boolean,
  ): GetUserByIdResponseDto {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      status: user.status,
      total_months: user.total_months,
      metadata: user.metadata,
      created_at: user.created_at,
      current_tier_id: user.current_tier_id ?? 0,
      haveActiveSubscription,
    };
  }
}
