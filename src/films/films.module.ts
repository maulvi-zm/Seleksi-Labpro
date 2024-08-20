import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { StorageModule } from 'src/storage/storage.module';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService],
  imports: [StorageModule, NestjsFormDataModule],
  exports: [FilmsService],
})
export class FilmsModule {}
