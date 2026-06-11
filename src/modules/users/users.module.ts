import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/entities/user.entity';
import { UsersController } from './presentation/controllers/users.controller';
import { UsersService } from './infrastructure/services/users.service';
import { CreateUserMapper } from './infrastructure/mappers/createUser.mapper';
import { TiersModule } from '../tiers/tiers.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { GetUserByIdMapper } from './infrastructure/mappers/getUserById.mapper';
import { GetUsersMapper } from './infrastructure/mappers/getUsers.mapper';
// import { SubscriptionExpCron } from './presentation/crons/subscrioptionExp.cron';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    TiersModule,
    SubscriptionsModule,
    QueuesModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserMapper,
    GetUserByIdMapper,
    GetUsersMapper,
    // SubscriptionExpCron,
  ],
  exports: [UsersService],
})
export class UsersModule {}
