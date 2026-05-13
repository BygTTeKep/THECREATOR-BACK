import { UserStatus } from 'src/modules/users/domain/enums/userStatus.enum';

/**
 * DTO для создания пользователя
 */
export class CreateUserDto {
  email: string;
  phone: string;
  status: UserStatus;
  total_months: number;
  metadata: Record<string, any>;
  created_at: Date;
  current_tier_id: number | null;
  subscription_id: number | null;
}
