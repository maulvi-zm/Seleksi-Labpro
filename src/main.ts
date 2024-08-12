import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CustomExceptionFilter } from './common/filters/CustomExceptionFilter';
import { CustomResponseInterceptor } from './common/interceptors/CustomResponseInterceptor';
import * as CookieParser from 'cookie-parser';
import * as expressLayouts from 'express-ejs-layouts';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new CustomResponseInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Seleksi Labpro API')
    .setDescription('API documentation for Movie Streaming Website')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Monolith Frontend
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.use(CookieParser());

  app.use(expressLayouts);
  app.set('layout', 'layouts/layout');

  app.enableCors({
    origin: ['https://labpro-fe.hmif.dev'],
    methods: 'GET,HEAD,PUT,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
