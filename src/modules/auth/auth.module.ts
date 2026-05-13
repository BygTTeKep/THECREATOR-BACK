import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './infrastructure/services/auth.service';

import { UsersModule } from '../users/users.module';
import { SmsModule } from '../sms/sms.module';
@Module({
  imports: [UsersModule, SmsModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
