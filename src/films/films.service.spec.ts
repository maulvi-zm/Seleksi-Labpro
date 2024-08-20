import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MemoryStoredFile } from 'nestjs-form-data';

describe('FilmsService', () => {
  let service: FilmsService;
  let prismaService: PrismaService;
  let storageService: StorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: PrismaService,
          useValue: {
            film: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            director: {
              upsert: jest.fn(),
            },
            genre: {
              upsert: jest.fn(),
            },
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: StorageService,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
    prismaService = module.get<PrismaService>(PrismaService);
    storageService = module.get<StorageService>(StorageService);
  });

  describe('create', () => {
    it('should create a film successfully', async () => {
      const createFilmDto = {
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
      const uploadedVideoUrl = 'https://cdn.example.com/test-video.mp4';
      const uploadedCoverImageUrl = 'https://cdn.example.com/test-cover.jpg';
      const director = { director_id: 1, name: 'Test Director' };
      const genres = [
        { genre_id: 1, name: 'Action' },
        { genre_id: 2, name: 'Drama' },
      ];
      const film = {
        film_id: '1',
        ...createFilmDto,
        video_url: uploadedVideoUrl,
        cover_image_url: uploadedCoverImageUrl,
        director_id: director.director_id,
        genres,
        Director: director,
        average_star: 0,
        review_count: 0,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(storageService, 'uploadFile')
        .mockResolvedValueOnce(uploadedVideoUrl);
      jest
        .spyOn(storageService, 'uploadFile')
        .mockResolvedValueOnce(uploadedCoverImageUrl);
      jest.spyOn(prismaService.director, 'upsert').mockResolvedValue(director);
      jest
        .spyOn(prismaService.genre, 'upsert')
        .mockResolvedValueOnce(genres[0]);
      jest
        .spyOn(prismaService.genre, 'upsert')
        .mockResolvedValueOnce(genres[1]);
      jest.spyOn(prismaService.film, 'create').mockResolvedValue(film);

      const result = await service.create(createFilmDto);

      expect(storageService.uploadFile).toHaveBeenCalledTimes(2);
      expect(prismaService.director.upsert).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(prismaService.genre.upsert).toHaveBeenCalledTimes(2);
      expect(prismaService.film.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(result).toEqual(expect.any(Object)); // FilmResponseDto
    });

    it('should throw BadRequestException if video upload fails', async () => {
      const createFilmDto = {
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

      jest.spyOn(storageService, 'uploadFile').mockResolvedValue(null);

      await expect(service.create(createFilmDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of films', async () => {
      const films = [
        {
          title: 'Film 1',
          director_id: 1,
          Director: { director_id: 1, name: 'Director 1' },
          film_id: '1',
          created_at: new Date(),
          updated_at: new Date(),
          average_star: 0,
          review_count: 0,
          description: 'Description 1',
          release_year: 2020,
          price: 10,
          duration: 120,
          video_url: 'https://cdn.example.com/video.mp4',
          cover_image_url: 'https://cdn.example.com/cover.jpg',
          genres: ['Action', 'Drama'],
        },
        {
          title: 'Film 2',
          director_id: 2,
          Director: { director_id: 2, name: 'Director 2' },
          film_id: '2',
          created_at: new Date(),
          updated_at: new Date(),
          average_star: 0,
          review_count: 0,
          description: 'Description 2',
          release_year: 2020,
          price: 10,
          duration: 120,
          video_url: 'https://cdn.example.com/video.mp4',
          cover_image_url: 'https://cdn.example.com/cover.jpg',
          genres: ['Action', 'Comedy'],
        },
      ];

      jest.spyOn(prismaService.film, 'findMany').mockResolvedValue(films);

      const result = await service.findAll('Film');

      expect(prismaService.film.findMany).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(result).toHaveLength(2);
    });
  });

  describe('findOne', () => {
    it('should return a film', async () => {
      const film = {
        title: 'Film 1',
        director_id: 1,
        Director: { director_id: 1, name: 'Director 1' },
        film_id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        average_star: 0,
        review_count: 0,
        description: 'Description 1',
        release_year: 2020,
        price: 10,
        duration: 120,
        video_url: 'https://cdn.example.com/video.mp4',
        cover_image_url: 'https://cdn.example.com/cover.jpg',
        genres: ['Action', 'Drama'],
      };

      jest.spyOn(prismaService.film, 'findUnique').mockResolvedValue(film);

      const result = await service.findOne('1');

      expect(prismaService.film.findUnique).toHaveBeenCalledWith({
        where: { film_id: '1' },
        include: expect.any(Object),
      });
      expect(result).toEqual(expect.any(Object)); // FilmResponseDto
    });

    it('should throw NotFoundException if film not found', async () => {
      jest.spyOn(prismaService.film, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a film', async () => {
      const updateFilmDto = {
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
      const film = {
        title: 'Film 1',
        director_id: 1,
        Director: { director_id: 1, name: 'Director 1' },
        film_id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        average_star: 0,
        review_count: 0,
        description: 'Description 1',
        release_year: 2020,
        price: 10,
        duration: 120,
        genres: ['Action', 'Drama'],
        video_url: 'https://cdn.example.com/video.mp4',
        cover_image_url: 'https://cdn.example.com/cover.jpg',
      };

      const updatedVideoUrl = 'https://cdn.example.com/updated-video.mp4';
      const updatedCoverImageUrl = 'https://cdn.example.com/updated-cover.jpg';
      const director = { director_id: 1, name: 'Updated Director' };
      const genres = [
        { genre_id: 1, name: 'Action' },
        { genre_id: 2, name: 'Comedy' },
      ];

      jest.spyOn(prismaService.film, 'findUnique').mockResolvedValue(film);
      jest.spyOn(storageService, 'deleteFile').mockImplementation();
      jest
        .spyOn(storageService, 'uploadFile')
        .mockResolvedValueOnce(updatedVideoUrl);
      jest
        .spyOn(storageService, 'uploadFile')
        .mockResolvedValueOnce(updatedCoverImageUrl);
      jest.spyOn(prismaService.director, 'upsert').mockResolvedValue(director);
      jest
        .spyOn(prismaService.genre, 'upsert')
        .mockResolvedValueOnce(genres[0]);
      jest
        .spyOn(prismaService.genre, 'upsert')
        .mockResolvedValueOnce(genres[1]);
      jest
        .spyOn(prismaService.film, 'update')
        .mockResolvedValue({ ...film, ...updateFilmDto });

      const result = await service.update('1', updateFilmDto);

      expect(storageService.deleteFile).toHaveBeenCalledTimes(2);
      expect(storageService.uploadFile).toHaveBeenCalledTimes(2);
      expect(prismaService.film.update).toHaveBeenCalledWith(
        expect.any(Object),
      );
      expect(result).toEqual(expect.any(Object)); // FilmResponseDto
    });

    it('should throw NotFoundException if film not found for update', async () => {
      const updateFilmDto = {
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
      jest.spyOn(prismaService.film, 'findUnique').mockResolvedValue(null);

      await expect(service.update('1', updateFilmDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a film', async () => {
      const film = {
        title: 'Film 1',
        Director: { director_id: 1, name: 'Director 1' },
        director_id: 1,
        film_id: '1',
        created_at: new Date(),
        updated_at: new Date(),
        average_star: 0,
        review_count: 0,
        description: 'Description 1',
        release_year: 2020,
        price: 10,
        duration: 120,
        genres: ['Action', 'Drama'],
        video_url: 'https://cdn.example.com/video.mp4',
        cover_image_url: 'https://cdn.example.com/cover.jpg',
      };

      jest.spyOn(prismaService.film, 'findUnique').mockResolvedValue(film);
      jest.spyOn(prismaService.film, 'delete').mockResolvedValue(film);
      jest.spyOn(storageService, 'deleteFile').mockImplementation();

      const result = await service.remove('1');

      expect(prismaService.film.findUnique).toHaveBeenCalledWith({
        where: { film_id: '1' },
      });
      expect(prismaService.film.delete).toHaveBeenCalledWith({
        where: { film_id: '1' },
        include: expect.objectContaining({ Director: true, genres: true }),
      });
      expect(storageService.deleteFile).toHaveBeenCalledTimes(2);
      expect(result).toEqual(expect.any(Object)); // FilmResponseDto
    });

    it('should throw NotFoundException if film not found for deletion', async () => {
      jest.spyOn(prismaService.film, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
