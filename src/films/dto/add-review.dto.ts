import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsInt, IsPositive } from 'class-validator';

export class AddReviewDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  review: string;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Type(() => Number)
  @ApiProperty()
  rating: number;
}
