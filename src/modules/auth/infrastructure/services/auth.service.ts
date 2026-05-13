import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from 'src/modules/auth/presentation/dtos/login.dto';
import { UsersService } from 'src/modules/users/infrastructure/services/users.service';
import { RegisterRequestDto } from '../../presentation/dtos/register.dto';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { SmsService } from 'src/modules/sms/infrastructure/services/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}
  async sendVerificationCode(phone: string) {
    try {
      await this.smsService.sendCode(phone);
      return { message: 'Verification code sent successfully' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Failed to send verification code');
    }
  }
  async login(dto: LoginRequestDto) {
    const user = await this.usersService.findByPhone(dto.phone);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const verified = await this.smsService.verifyCode(
      dto.phone,
      dto.verificationCode,
    );
    if (!verified) {
      throw new UnauthorizedException('Invalid verification code');
    }
    const role = user.metadata?.role ?? RolesEnum.USER;
    const token = this.jwtService.sign({
      id: user.id,
      role,
      current_tier_id: user.current_tier_id,
    });
    return {
      access_token: token,
    };
  }
  async register(dto: RegisterRequestDto) {
    const userByPhone = await this.usersService.findByPhone(dto.phone);
    if (userByPhone) {
      throw new BadRequestException('User already exists');
    }
    const userByEmail = await this.usersService.findByEmail(dto.email);
    if (userByEmail) {
      throw new BadRequestException('User already exists');
    }
    const verified = await this.smsService.verifyCode(
      dto.phone,
      dto.verificationCode,
    );
    if (!verified) {
      throw new UnauthorizedException('Invalid verification code');
    }
    const newUser = await this.usersService.createUser({
      phone: dto.phone,
      email: dto.email,
      verificationCode: dto.verificationCode,
    });

    const role = newUser.metadata?.role ?? RolesEnum.USER;
    const token = this.jwtService.sign({ id: newUser.id, role });
    return {
      access_token: token,
    };
  }
}
