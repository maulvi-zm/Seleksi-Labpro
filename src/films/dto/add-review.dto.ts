import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsNumber,
  Max,
} from 'class-validator';

export class AddReviewDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  comment: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(5)
  @Type(() => Number)
  @ApiProperty()
  star: number;
}
