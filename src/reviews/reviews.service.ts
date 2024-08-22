import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from '../prisma/prisma.service';
import { FilmsService } from '../films/films.service';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filmsService: FilmsService,
  ) {}

  async addReview(filmId: string, review: CreateReviewDto, user_id: string) {
    const film = await this.prismaService.film.findUnique({
      where: { film_id: filmId },
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    const isPurchased = await this.filmsService.isPurchased(filmId, user_id);
    if (!isPurchased) {
      throw new BadRequestException('You have not purchased this film');
    }

    const reviewResult = await this.prismaService.review.create({
      data: {
        comment: review.comment,
        star: review.star,
        user_id: user_id,
        film_id: filmId,
      },
    });

    return reviewResult;
  }

  async getReviewswithPagination(
    filmId: string,
    user_id?: string,
    page: number = 1,
    limit: number = 5,
  ) {
    const [reviews, total] = await this.prismaService.$transaction([
      this.prismaService.review.findMany({
        where: { film_id: filmId },
        select: {
          review_id: true,
          star: true,
          comment: true,
          created_at: true,
          User: { select: { user_id: true, first_name: true } },
        },
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.review.count({ where: { film_id: filmId } }),
    ]);

    let reviewsWithOwnership = reviews;
    if (user_id) {
      reviewsWithOwnership = reviews.map((review) => ({
        ...review,
        owned: review.User.user_id === user_id,
      }));

      reviewsWithOwnership.forEach((review) => {
        delete review.User.user_id;
      });
    }

    return { reviews: reviewsWithOwnership, total, page };
  }

  async deleteReview(reviewId: number, user_id: string) {
    const reviewData = await this.prismaService.review.findUnique({
      where: { review_id: reviewId },
    });

    if (!reviewData) {
      throw new NotFoundException('Review not found');
    }

    if (reviewData.user_id !== user_id) {
      throw new BadRequestException('You can only delete your own review');
    }

    await this.prismaService.review.delete({ where: { review_id: reviewId } });

    return { message: 'Review deleted successfully' };
  }
}
