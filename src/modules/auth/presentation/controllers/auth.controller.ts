import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/infrastructure/services/auth.service';
import { LoginRequestDto } from '../dtos/login.dto';
import { SendCodeRequestDto } from '../dtos/sendCode.dto';
import { RegisterRequestDto } from '../dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }
  @Post('send-code')
  async sendCode(@Body() dto: SendCodeRequestDto) {
    return this.authService.sendVerificationCode(dto.phone);
  }
  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }
}
