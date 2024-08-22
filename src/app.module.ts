import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilmsModule } from './films/films.module';
import { StorageModule } from './storage/storage.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { TokenExpirationMiddleware } from './common/middleware/TokenExpirationMiddleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ReviewsModule } from './reviews/reviews.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserMiddleware } from './common/middleware/UserMiddleware';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    FilmsModule,
    StorageModule,
    ReviewsModule,
    PrismaModule,
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const store = await redisStore({
          ttl: 60 * 1000,
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          password: configService.get<string>('REDIS_PASSWORD') || undefined,
        });

        return { store };
      },
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenExpirationMiddleware)
      .forRoutes(
        { path: 'logout', method: RequestMethod.GET },
        { path: 'films', method: RequestMethod.ALL },
        { path: 'my-films', method: RequestMethod.ALL },
      );
    consumer.apply(UserMiddleware).forRoutes('*');
  }
}
