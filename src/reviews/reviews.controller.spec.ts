import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { NestjsFormDataModule } from 'nestjs-form-data';

describe('ReviewsController', () => {
  let controller: ReviewsController;
  let reviewsService: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController],
      providers: [
        {
          provide: ReviewsService,
          useValue: {
            addReview: jest.fn(),
            getReviewswithPagination: jest.fn(),
            deleteReview: jest.fn(),
          },
        },
      ],
      imports: [NestjsFormDataModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<ReviewsController>(ReviewsController);
    reviewsService = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addReview', () => {
    it('should throw an error if referer does not match film_id', async () => {
      const req = {
        headers: {
          referer: 'http://localhost:3000/some-other-id',
        },
        user: {
          id: 'user-id',
        },
      };
      const dto: CreateReviewDto = { comment: 'Great movie!', star: 5 };

      try {
        await controller.addReview('film-id', dto, req);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Invalid request');
      }
    });

    it('should call reviewsService.addReview with correct parameters', async () => {
      const req = {
        headers: {
          referer: 'http://localhost:3000/film-id',
        },
        user: {
          id: 'user-id',
        },
      };
      const dto: CreateReviewDto = { comment: 'Great movie!', star: 5 };
      const result = {
        review_id: 1,
        ...dto,
        user_id: 'user-id',
        film_id: 'film-id',
        created_at: new Date(),
      };
      jest.spyOn(reviewsService, 'addReview').mockResolvedValue(result);

      expect(await controller.addReview('film-id', dto, req)).toBe(result);
      expect(reviewsService.addReview).toHaveBeenCalledWith(
        'film-id',
        dto,
        'user-id',
      );
    });
  });

  describe('getReview', () => {
    it('should call reviewsService.getReviewswithPagination with correct parameters', async () => {
      const req = {
        user: {
          id: 'user-id',
        },
      };
      const result = { reviews: [], total: 0, page: 1 };
      jest
        .spyOn(reviewsService, 'getReviewswithPagination')
        .mockResolvedValue(result);

      expect(await controller.getReview('film-id', 1, 5, req)).toBe(result);
      expect(reviewsService.getReviewswithPagination).toHaveBeenCalledWith(
        'film-id',
        'user-id',
        1,
        5,
      );
    });

    it('should use default values for page and limit if not provided', async () => {
      const req = {
        user: {
          id: 'user-id',
        },
      };
      const result = { reviews: [], total: 0, page: 1 };
      jest
        .spyOn(reviewsService, 'getReviewswithPagination')
        .mockResolvedValue(result);

      expect(
        await controller.getReview('film-id', undefined, undefined, req),
      ).toBe(result);
      expect(reviewsService.getReviewswithPagination).toHaveBeenCalledWith(
        'film-id',
        'user-id',
        1,
        5,
      );
    });
  });

  describe('deleteReview', () => {
    it('should call reviewsService.deleteReview with correct parameters', async () => {
      const req = {
        user: {
          id: 'user-id',
        },
      };
      const result = { message: 'Review deleted successfully' };
      jest.spyOn(reviewsService, 'deleteReview').mockResolvedValue(result);

      expect(await controller.deleteReview('1', req)).toBe(result);
      expect(reviewsService.deleteReview).toHaveBeenCalledWith(1, 'user-id');
    });
  });
});
