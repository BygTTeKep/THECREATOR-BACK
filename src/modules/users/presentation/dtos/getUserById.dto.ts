import { ApiProperty } from '@nestjs/swagger';
import { UserStatus } from '../../domain/enums/userStatus.enum';

export class GetUserByIdResponseDto {
  @ApiProperty({ description: 'The ID of the user' })
  id: string;
  @ApiProperty({ description: 'The email of the user' })
  email: string;
  @ApiProperty({ description: 'The phone of the user' })
  phone: string;
  @ApiProperty({ description: 'The status of the user' })
  status: UserStatus;
  @ApiProperty({ description: 'The total months of the user' })
  total_months: number;
  @ApiProperty({ description: 'The metadata of the user' })
  metadata: Record<string, any>;
  @ApiProperty({ description: 'The created at of the user' })
  created_at: Date;
  @ApiProperty({ description: 'The current tier id of the user' })
  current_tier_id: number;
  @ApiProperty({ description: 'The have active subscription of the user' })
  haveActiveSubscription: boolean;
}
