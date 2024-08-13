import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService],
  imports: [PrismaModule, StorageModule, NestjsFormDataModule],
  exports: [FilmsService],
})
export class FilmsModule {}
