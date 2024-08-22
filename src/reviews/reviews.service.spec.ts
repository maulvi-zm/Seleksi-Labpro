import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { FilmsService } from '../films/films.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let prismaService: PrismaService;
  let filmsService: FilmsService;

  const filmData = {
    film_id: '1',
    title: 'Film 1',
    description: 'Description',
    director_id: 1,
    release_year: 2021,
    price: 10,
    duration: 120,
    cover_image_url: 'https://example.com',
    average_star: 4,
    review_count: 1,
    video_url: 'https://example.com',
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: PrismaService,
          useValue: {
            film: { findUnique: jest.fn() },
            review: {
              create: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: FilmsService,
          useValue: {
            isPurchased: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    prismaService = module.get<PrismaService>(PrismaService);
    filmsService = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addReview', () => {
    it('should throw NotFoundException if film does not exist', async () => {
      jest.spyOn(prismaService.film, 'findUnique').mockResolvedValue(null);

      await expect(
        service.addReview('1', { comment: 'Great!', star: 5 }, 'user1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user has not purchased the film', async () => {
      jest.spyOn(prismaService.film, 'findUnique').mockResolvedValue(filmData);
      jest.spyOn(filmsService, 'isPurchased').mockResolvedValue(false);

      await expect(
        service.addReview('1', { comment: 'Great!', star: 5 }, 'user1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should add a review if the film exists and user has purchased it', async () => {
      jest.spyOn(prismaService.film, 'findUnique').mockResolvedValue(filmData);
      jest.spyOn(filmsService, 'isPurchased').mockResolvedValue(true);
      const reviewData = {
        review_id: 1,
        comment: 'Great!',
        star: 5,
        user_id: 'user1',
        film_id: '1',
        created_at: new Date(),
      };
      jest.spyOn(prismaService.review, 'create').mockResolvedValue(reviewData);

      const result = await service.addReview('1', reviewData, 'user1');
      expect(result).toEqual(reviewData);
    });
  });

  describe('getReviewswithPagination', () => {
    it('should return reviews with pagination', async () => {
      const reviews = [
        {
          review_id: 1,
          star: 5,
          comment: 'Good',
          created_at: new Date(),
          User: { user_id: 'user1', first_name: 'User1' },
        },
        {
          review_id: 2,
          star: 4,
          comment: 'Nice',
          created_at: new Date(),
          User: { user_id: 'user2', first_name: 'User2' },
        },
      ];

      const total = 2;

      const expected = {
        reviews: reviews.map((review) => ({
          ...review,
          owned: review.User.user_id === 'user1',
        })),
        total: 2,
        page: 1,
      };

      jest
        .spyOn(prismaService, '$transaction')
        .mockResolvedValue([reviews, total]);

      const result = await service.getReviewswithPagination('1', 'user1', 1, 2);

      expect(result).toEqual(expected);
    });
  });

  describe('deleteReview', () => {
    it('should throw NotFoundException if review does not exist', async () => {
      jest.spyOn(prismaService.review, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteReview(1, 'user1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw BadRequestException if user tries to delete another user's review", async () => {
      jest.spyOn(prismaService.review, 'findUnique').mockResolvedValue({
        review_id: 1,
        user_id: 'user2',
        film_id: '1',
        star: 5,
        comment: 'Great!',
        created_at: new Date(),
      });

      await expect(service.deleteReview(1, 'user1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should delete the review if it exists and belongs to the user', async () => {
      const reviewData = {
        review_id: 1,
        user_id: 'user1',
        film_id: '1',
        star: 5,
        comment: 'Great!',
        created_at: new Date(),
      };
      jest
        .spyOn(prismaService.review, 'findUnique')
        .mockResolvedValue(reviewData);
      jest.spyOn(prismaService.review, 'delete').mockResolvedValue(reviewData);

      const result = await service.deleteReview(1, 'user1');
      expect(result).toEqual({ message: 'Review deleted successfully' });
    });
  });
});
