import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { FilmsModule } from 'src/films/films.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [FilmsModule, PrismaModule, NestjsFormDataModule],
  exports: [ReviewsService],
})
export class ReviewsModule {}
