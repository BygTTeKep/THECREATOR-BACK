import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TiersModule } from './modules/tiers/tiers.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { DropsModule } from './modules/drops/drops.module';
import { ProductsModule } from './modules/products/products.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { RulesModule } from './modules/rules/rules.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { join } from 'node:path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesModule } from './modules/files/files.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { HttpModule } from '@nestjs/axios';
import { SmsModule } from './modules/sms/sms.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';
import { DeliveryModule } from './modules/delivery/delivery.module';
import { FeatureFlagModule } from './modules/features-flag/featureFlag.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PaymentModule } from './modules/payment/payment.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { QueuesModule } from './modules/queues/queues.module';
import { BullModule } from '@nestjs/bullmq';
import { SocialMediaModule } from './modules/socialmedia/socialmedia.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (c: ConfigService) => {
        return {
          type: 'postgres',
          host: c.get<string>('DB_HOST'),
          port: c.get<number>('DB_PORT'),
          username: c.get<string>('DB_USERNAME'),
          password: c.get<string>('DB_PASSWORD'),
          database: c.get<string>('DB_DATABASE'),
          autoLoadEntities: c.get<boolean>('DB_AUTO_LOAD_ENTITIES'),
          synchronize: c.get<string>('DB_SYNCHRONIZE') === 'true',
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '7d' },
      global: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ScheduleModule.forRoot({ cronJobs: true }),
    HttpModule.registerAsync({
      useFactory: () => {
        return {
          timeout: 5000,
          maxRedirects: 5,
        };
      },
      inject: [ConfigService],
      global: true,
    }),
    CacheModule.registerAsync({
      useFactory: (c: ConfigService) => {
        return {
          stores: [
            new Keyv({
              store: new KeyvCacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis(c.get<string>('REDIS_URL')),
          ],
        };
      },
      inject: [ConfigService],
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (c: ConfigService) => {
        return { connection: { url: c.get<string>('REDIS_URL') } };
      },
    }),
    TelegramModule,
    UsersModule,
    TiersModule,
    SubscriptionsModule,
    DropsModule,
    ProductsModule,
    InventoryModule,
    RulesModule,
    OrdersModule,
    AuthModule,
    FilesModule,
    SmsModule,
    DeliveryModule,
    FeatureFlagModule,
    EventEmitterModule.forRoot({
      global: true,
    }),
    PaymentModule,
    NotificationsModule,
    QueuesModule,
    SocialMediaModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
