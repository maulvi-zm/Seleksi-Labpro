import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomResponseInterceptor } from './common/interceptors/CustomResponseInterceptor';
import { CustomExceptionFilter } from './common/filters/CustomExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

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

  await app.listen(3000);
}
bootstrap();
