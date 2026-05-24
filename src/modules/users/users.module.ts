import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/entities/user.entity';
import { UsersController } from './presentation/controllers/users.controller';
import { UsersService } from './infrastructure/services/users.service';
import { CreateUserMapper } from './infrastructure/mappers/createUser.mapper';
import { TiersModule } from '../tiers/tiers.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { GetUserByIdMapper } from './infrastructure/mappers/getUserById.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TiersModule,
    SubscriptionsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, CreateUserMapper, GetUserByIdMapper],
  exports: [UsersService],
})
export class UsersModule {}
