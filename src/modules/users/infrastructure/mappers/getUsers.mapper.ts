import { Injectable } from '@nestjs/common';
import { GetUserResponseDto } from '../../presentation/dtos/getUser.dto';

@Injectable()
export class GetUsersMapper {
  toDto(data: any[]): GetUserResponseDto[] {
    return data.map((d) => {
      return {
        id: d.id,
        status: d.status,
        email: d.email,
        phone: d.phone,
        total_months: d.total_months,
        created_at: d.created_at,
        current_tier_id: d.current_tier_id,
      };
    });
  }
}
