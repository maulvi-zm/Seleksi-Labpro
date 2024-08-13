import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFilmDto } from './create-film.dto';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { IsOptional } from 'class-validator';

export class UpdateFilmDto extends CreateFilmDto {
  @IsFile()
  @IsOptional()
  @HasMimeType(['video/*'])
  @MaxFileSize(200 * 1024 * 1024) // 200 MB
  @ApiProperty({ type: 'string', format: 'binary' })
  video: MemoryStoredFile;

  @IsFile()
  @IsOptional()
  @HasMimeType(['image/*'])
  @MaxFileSize(20 * 1024 * 1024) // 20 MB
  @ApiProperty({ type: 'string', format: 'binary' })
  cover_image: MemoryStoredFile;
}
