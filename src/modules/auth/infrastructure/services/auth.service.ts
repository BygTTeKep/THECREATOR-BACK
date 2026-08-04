import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Logger,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequestDto } from 'src/modules/auth/presentation/dtos/login.dto';
import { UsersService } from 'src/modules/users/infrastructure/services/users.service';
import { RegisterRequestDto } from '../../presentation/dtos/register.dto';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { SmsService } from 'src/modules/sms/infrastructure/services/sms.service';
import { hashPassword } from 'src/core/utils/password/hashPassword';
import { comparePassword } from 'src/core/utils/password/comparePassword';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
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
      this.logger.error(error);
      throw new BadRequestException('Failed to send verification code');
    }
  }
  async login(dto: LoginRequestDto) {
    const user = await this.usersService.findByPhoneWithPassword(dto.phone);
    if (!user?.password) {
      throw new UnauthorizedException('Invalid phone or password');
    }
    const verified = await comparePassword(dto.password, user.password);
    if (!verified) {
      throw new UnauthorizedException('Invalid phone or password');
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
    try {
      const userByPhone = await this.usersService.findByPhone(dto.phone);
      if (userByPhone) {
        throw new ConflictException('User already exists');
      }
      const userByEmail = await this.usersService.findByEmail(dto.email);
      if (userByEmail) {
        throw new ConflictException('User already exists');
      }
      const hashedPassword = await hashPassword(dto.password);
      const newUser = await this.usersService.createUser({
        phone: dto.phone,
        email: dto.email,
        password: hashedPassword,
      });

      const role = newUser.metadata?.role ?? RolesEnum.USER;
      const token = this.jwtService.sign({ id: newUser.id, role });
      return {
        access_token: token,
      };
    } catch (error) {
      this.logger.error(error);
      if (
        error instanceof ConflictException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadRequestException('Failed to register user');
    }
  }
  async verifyPhoneAndEmail(phone: string, email: string) {
    const userByPhone = await this.usersService.findByPhone(phone);
    if (userByPhone) {
      throw new ConflictException('User already exists');
    }
    const userByEmail = await this.usersService.findByEmail(email);
    if (userByEmail) {
      throw new ConflictException('User already exists');
    }
    return true;
  }
}
