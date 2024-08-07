import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilmsModule } from './films/films.module';
import { CloudflareModule } from './cloudflare/cloudflare.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { TokenExpirationMiddleware } from './auth/middleware/TokenExpirationMiddleware';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    FilmsModule,
    CloudflareModule,
    NestjsFormDataModule.config({
      storage: MemoryStoredFile,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenExpirationMiddleware)
      .forRoutes(
        { path: 'logout', method: RequestMethod.GET },
        { path: '*', method: RequestMethod.ALL },
      );
  }
}
