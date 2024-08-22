import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Role } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      imports: [NestjsFormDataModule],
      providers: [
        {
          provide: FilmsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            buyFilm: jest.fn(),
            addWishlist: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  describe('create', () => {
    it('should create a film successfully', async () => {
      const createFilmDto: CreateFilmDto = {
        title: 'Test Film',
        description: 'Test Description',
        director: 'Test Director',
        release_year: 2024,
        price: 10,
        duration: 120,
        video: new MemoryStoredFile(),
        cover_image: new MemoryStoredFile(),
        genre: ['Action', 'Drama'],
      };

      const createdFilm = {
        id: '1',
        title: 'Test Film',
        description: 'Test Description',
        director: 'Test Director',
        release_year: 2024,
        price: 10,
        duration: 120,
        genre: ['Action', 'Drama'],
        video_url: 'test-video.mp4',
        cover_image_url: 'test-cover.jpg',
        created_at: new Date(),
        updated_at: new Date(),
        average_star: 0,
        review_count: 0,
      };
      jest.spyOn(service, 'create').mockResolvedValue(createdFilm);

      const result = await controller.create(createFilmDto);

      expect(service.create).toHaveBeenCalledWith(createFilmDto);
      expect(result).toEqual(createdFilm);
    });
  });

  describe('findAll', () => {
    it('should return all films', async () => {
      const query = 'Test';
      const films = [
        {
          title: 'Film 1',
          director: 'Director 1',
          id: '1',
          created_at: new Date(),
          updated_at: new Date(),
          average_star: 0,
          review_count: 0,
          description: 'Description 1',
          release_year: 2020,
          price: 10,
          duration: 120,
          genre: ['Action', 'Drama'],
          video_url: 'https://cdn.example.com/video.mp4',
          cover_image_url: 'https://cdn.example.com/cover.jpg',
        },
        {
          title: 'Film 2',
          director: 'Director 2',
          id: '2',
          created_at: new Date(),
          updated_at: new Date(),
          average_star: 0,
          review_count: 0,
          description: 'Description 2',
          release_year: 2020,
          price: 10,
          duration: 120,
          genre: ['Action', 'Drama'],
          video_url: 'https://cdn.example.com/video.mp4',
          cover_image_url: 'https://cdn.example.com/cover.jpg',
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(films);

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(films);
    });
  });

  describe('findOne', () => {
    it('should return a film by ID', async () => {
      const id = '1';
      const film = {
        id,
        title: 'Film 1',
        director: 'Director 1',
        film_id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        average_star: 0,
        review_count: 0,
        description: 'Description 1',
        release_year: 2020,
        price: 10,
        duration: 120,
        genre: ['Action', 'Drama'],
        video_url: 'https://cdn.example.com/video.mp4',
        cover_image_url: 'https://cdn.example.com/cover.jpg',
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(film);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(film);
    });

    it('should throw NotFoundException if film not found', async () => {
      const id = '1';
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a film successfully', async () => {
      const id = '1';
      const updateFilmDto: UpdateFilmDto = {
        title: 'Updated Film',
        description: 'Updated Description',
        director: 'Updated Director',
        release_year: 2024,
        price: 20,
        duration: 140,
        video: new MemoryStoredFile(),
        cover_image: new MemoryStoredFile(),
        genre: ['Action', 'Comedy'],
      };
      const updatedFilm = {
        id,
        title: 'Updated Film',
        description: 'Updated Description',
        director: 'Updated Director',
        release_year: 2024,
        price: 20,
        duration: 140,
        video_url: 'updated-video.mp4',
        cover_image_url: 'updated-cover.jpg',
        genre: ['Action', 'Comedy'],
        created_at: new Date(),
        updated_at: new Date(),
        average_star: 0,
        review_count: 0,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedFilm);

      const result = await controller.update(id, updateFilmDto);

      expect(service.update).toHaveBeenCalledWith(id, updateFilmDto);
      expect(result).toEqual(updatedFilm);
    });
  });

  describe('remove', () => {
    it('should delete a film by ID', async () => {
      const id = '1';
      const removedFilm = {
        id,
        title: 'Film 1',
        director: 'Director 1',
        film_id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        average_star: 0,
        review_count: 0,
        description: 'Description 1',
        release_year: 2020,
        price: 10,
        duration: 120,
        genre: ['Action', 'Drama'],
        video_url: 'https://cdn.example.com/video.mp4',
        cover_image_url: 'https://cdn.example.com/cover.jpg',
      };

      jest.spyOn(service, 'remove').mockResolvedValue(removedFilm);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toEqual(removedFilm);
    });

    it('should throw NotFoundException if film not found', async () => {
      const id = '1';
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('buyFilm', () => {
    it('should buy a film successfully', async () => {
      const id = '1';
      const userId = 'user-id';
      const request = {
        headers: { referer: `http://localhost/films/${id}` },
        user: { id: userId },
      };
      const purchaseConfirmation = {
        user_id: userId,
        username: 'newUser',
        email: 'user@example.com',
        password: 'password',
        first_name: 'John',
        last_name: 'Doe',
        role: Role.USER,
        balance: 0,
      };

      jest.spyOn(service, 'buyFilm').mockResolvedValue(purchaseConfirmation);

      const result = await controller.buyFilm(id, request);

      expect(service.buyFilm).toHaveBeenCalledWith(id, userId);
      expect(result).toEqual(purchaseConfirmation);
    });

    it('should throw an error for invalid request', async () => {
      const id = '1';
      const userId = 'user-id';
      const invalidRequest = {
        headers: { referer: `http://localhost/films/2` },
        user: { id: userId },
      };

      try {
        controller.buyFilm(id, invalidRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Invalid request');
      }
    });
  });

  describe('addWishlist', () => {
    it('should add a film to the wishlist successfully', async () => {
      const id = '1';
      const userId = 'user-id';
      const request = {
        headers: { referer: `http://localhost/films/${id}` },
        user: { id: userId },
      };
      const wishlistConfirmation = true;
      jest
        .spyOn(service, 'addWishlist')
        .mockResolvedValue(wishlistConfirmation);

      const result = await controller.addWishlist(id, request);

      expect(service.addWishlist).toHaveBeenCalledWith(id, userId);
      expect(result).toEqual(wishlistConfirmation);
    });

    it('should throw an error for invalid request', async () => {
      const id = '1';
      const userId = 'user-id';
      const invalidRequest = {
        headers: { referer: `http://localhost/films/2` },
        user: { id: userId },
      };

      try {
        controller.addWishlist(id, invalidRequest);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Invalid request');
      }
    });
  });
});
