import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
  Render,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FormDataRequest, MemoryStoredFile } from 'nestjs-form-data';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':film_id')
  @ApiOperation({ summary: 'Add a review' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @FormDataRequest({ storage: MemoryStoredFile })
  addReview(
    @Param('film_id') id: string,
    @Body() addReviewDto: CreateReviewDto,
    @Req() req: any,
  ) {
    if (req.headers.referer.split('/').pop() !== id) {
      throw new Error('Invalid request');
    }

    return this.reviewsService.addReview(id, addReviewDto, req.user.id);
  }

  @Get(':film_id')
  @ApiOperation({ summary: 'Get reviews with pagination' })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @FormDataRequest({ storage: MemoryStoredFile })
  @Render('partials/reviews')
  getReview(
    @Param('film_id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Req() req: any,
  ) {
    page = page || 1;
    limit = limit || 5;
    return this.reviewsService.getReviewswithPagination(
      id,
      req.user.id,
      page,
      limit,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a review' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteReview(@Param('id') id: string, @Req() req: any) {
    return this.reviewsService.deleteReview(parseInt(id), req.user.id);
  }
}
