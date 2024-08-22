import {
  IsString,
  IsInt,
  IsArray,
  IsPositive,
  IsNumber,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { Transform, Type } from 'class-transformer';

export class CreateFilmDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  director: string;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty()
  release_year: number;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ type: [String] })
  @Transform(({ value }) =>
    typeof value === 'string' && !value.includes(',') ? [value] : value,
  )
  genre: string[];

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty()
  duration: number;

  @IsFile()
  @HasMimeType(['video/*'])
  @MaxFileSize(200 * 1024 * 1024) // 200 MB
  @ApiProperty({ type: 'string', format: 'binary' })
  video: MemoryStoredFile;

  @IsFile()
  @IsOptional()
  @HasMimeType(['image/*'])
  @MaxFileSize(2 * 1024 * 1024) // 20 MB
  @ApiProperty({ type: 'string', format: 'binary' })
  cover_image: MemoryStoredFile;
}
