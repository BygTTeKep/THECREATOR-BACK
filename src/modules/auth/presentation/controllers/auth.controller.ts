import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/infrastructure/services/auth.service';
import { LoginRequestDto } from '../dtos/login.dto';
import { SendCodeRequestDto } from '../dtos/sendCode.dto';
import { RegisterRequestDto } from '../dtos/register.dto';
import { VerifyPhoneAndEmailRequestDto } from '../dtos/verifyPhoneAndEmail.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User logged in' })
  @ApiResponse({ status: 400, description: 'Invalid phone or email' })
  @ApiResponse({ status: 401, description: 'Invalid phone or password' })
  @ApiBody({ type: LoginRequestDto })
  async login(@Body() dto: LoginRequestDto) {
    return this.authService.login(dto);
  }
  @ApiOperation({ summary: 'Send verification code' })
  @ApiResponse({ status: 200, description: 'Verification code sent' })
  @ApiBody({ type: SendCodeRequestDto })
  @Post('send-code')
  async sendCode(@Body() dto: SendCodeRequestDto) {
    return this.authService.sendVerificationCode(dto.phone);
  }
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 200, description: 'User registered' })
  @ApiResponse({ status: 400, description: 'Invalid phone or email' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBody({ type: RegisterRequestDto })
  @Post('register')
  async register(@Body() dto: RegisterRequestDto) {
    return this.authService.register(dto);
  }
  @ApiOperation({ summary: 'Verify phone and email' })
  @ApiResponse({ status: 200, description: 'Phone and email verified' })
  @ApiResponse({ status: 400, description: 'Invalid phone or email' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiBody({ type: VerifyPhoneAndEmailRequestDto })
  @Post('verify-phone-and-email')
  async verifyPhoneAndEmail(@Body() dto: VerifyPhoneAndEmailRequestDto) {
    return this.authService.verifyPhoneAndEmail(dto.phone, dto.email);
  }
}
