import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { FilmResponseDto } from './dto/film-response.dto';
import { Prisma } from '@prisma/client';
import { RecommendationQueryBuilder } from './utils/RecommendationQueryBuilder';

@Injectable()
export class FilmsService {
  constructor(
    private prismaService: PrismaService,
    private storageService: StorageService,
  ) {}

  async create(createFilmDto: CreateFilmDto) {
    const videoUrl = await this.storageService.uploadFile(createFilmDto.video);

    if (!videoUrl) {
      throw new BadRequestException('Failed to upload video');
    }

    let coverImageUrl = null;
    if (createFilmDto.cover_image) {
      coverImageUrl = await this.storageService.uploadFile(
        createFilmDto.cover_image,
      );
      if (!coverImageUrl) {
        throw new BadRequestException('Failed to upload cover image');
      }
    }

    // Find or create director
    const director = await this.prismaService.director.upsert({
      where: { name: createFilmDto.director, director_id: 0 },
      update: {},
      create: { name: createFilmDto.director },
    });

    // Find or create genres
    const genreResults = await Promise.all(
      createFilmDto.genre.map(async (genre) => {
        return await this.prismaService.genre.upsert({
          where: { name: genre, genre_id: 0 },
          update: {},
          create: { name: genre },
        });
      }),
    );

    const film = await this.prismaService.film.create({
      data: {
        title: createFilmDto.title,
        description: createFilmDto.description,
        director_id: director.director_id,
        release_year: createFilmDto.release_year,
        price: createFilmDto.price,
        duration: createFilmDto.duration,
        video_url: videoUrl,
        cover_image_url: coverImageUrl,
        genres: {
          connect: genreResults.map((genre) => ({ genre_id: genre.genre_id })),
        },
      },
      include: {
        genres: true,
        Director: true,
      },
    });

    return new FilmResponseDto(film);
  }

  async findAll(q: string) {
    const films = await this.prismaService.film.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { Director: { name: { contains: q, mode: 'insensitive' } } },
        ],
      },
      include: {
        genres: true,
        Director: true,
      },
    });

    return films.map((film) => new FilmResponseDto(film));
  }

  async findOne(id: string) {
    const film = await this.prismaService.film.findUnique({
      where: { film_id: id },
      include: {
        genres: true,
        Director: true,
      },
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    return new FilmResponseDto(film);
  }

  async update(id: string, updateFilmDto: UpdateFilmDto) {
    const film = await this.prismaService.film.findUnique({
      where: { film_id: id },
      select: { video_url: true, cover_image_url: true },
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    let videoUrl = film.video_url;

    if (updateFilmDto.video) {
      this.storageService.deleteFile(videoUrl);

      videoUrl = null;
      videoUrl = await this.storageService.uploadFile(updateFilmDto.video);

      if (!film.video_url) {
        throw new BadRequestException('Failed to upload video');
      }
    }

    let coverImageUrl = film.cover_image_url;

    if (updateFilmDto.cover_image) {
      this.storageService.deleteFile(coverImageUrl);

      coverImageUrl = null;
      coverImageUrl = await this.storageService.uploadFile(
        updateFilmDto.cover_image,
      );

      if (!coverImageUrl) {
        throw new BadRequestException('Failed to upload cover image');
      }
    }

    // Find or create director
    const director = await this.prismaService.director.upsert({
      where: { name: updateFilmDto.director, director_id: 0 },
      update: {},
      create: { name: updateFilmDto.director },
    });

    // Find or create genres
    const genreResults = await Promise.all(
      updateFilmDto.genre.map(async (genre) => {
        return await this.prismaService.genre.upsert({
          where: { name: genre, genre_id: 0 },
          update: {},
          create: { name: genre },
        });
      }),
    );

    const updatedFilm = await this.prismaService.film.update({
      where: { film_id: id },
      data: {
        title: updateFilmDto.title,
        description: updateFilmDto.description,
        release_year: updateFilmDto.release_year,
        price: updateFilmDto.price,
        duration: updateFilmDto.duration,
        video_url: videoUrl,
        cover_image_url: coverImageUrl,
        genres: {
          set: genreResults.map((genre) => ({ genre_id: genre.genre_id })),
        },
        Director: { connect: { director_id: director.director_id } },
      },
      include: {
        genres: true,
        Director: true,
      },
    });

    return new FilmResponseDto(updatedFilm);
  }

  async remove(id: string) {
    // Delete video amd cover image from Cloudflare
    const film = await this.prismaService.film.findUnique({
      where: { film_id: id },
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    if (film.video_url) {
      this.storageService.deleteFile(film.video_url);
    }

    if (film.cover_image_url) {
      this.storageService.deleteFile(film.cover_image_url);
    }

    return new FilmResponseDto(
      await this.prismaService.film.delete({
        where: { film_id: id },
        include: {
          genres: true,
          Director: true,
        },
      }),
    );
  }

  async findAllwithPagination(
    q: string = '',
    page: number = 1,
    limit: number = 9,
    user_id?: string,
    isWishlisted: boolean = false,
  ) {
    q = q || '';
    page = page || 1;
    limit = limit || 9;

    const userCondition = user_id
      ? isWishlisted
        ? { UsersWishList: { some: { user_id } } }
        : { UsersFilm: { some: { user_id } } }
      : {};

    const searchCondition = {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { Director: { name: { contains: q, mode: 'insensitive' } } },
      ],
    } satisfies Prisma.FilmWhereInput;

    const [films, total] = await this.prismaService.$transaction([
      this.prismaService.film.findMany({
        where: {
          AND: [userCondition, searchCondition],
        },
        skip: (page - 1) * limit,
        take: limit,
        include: { Director: true, genres: true },
      }),
      this.prismaService.film.count({
        where: {
          AND: [userCondition, searchCondition],
        },
      }),
    ]);

    return {
      q,
      films: films.map((film) => new FilmResponseDto(film)),
      total,
      page,
      limit,
    };
  }

  async buyFilm(filmId: string, user_id: string) {
    const film = await this.prismaService.film.findUnique({
      where: { film_id: filmId },
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    const user = await this.prismaService.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.balance < film.price) {
      throw new BadRequestException('Insufficient balance');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { user_id },
      data: {
        balance: {
          decrement: film.price,
        },
        filmBought: {
          connect: { film_id: filmId },
        },
      },
    });

    return updatedUser;
  }

  async isPurchased(filmId: string, user_id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { user_id },
      include: {
        filmBought: {
          where: { film_id: filmId },
        },
      },
    });

    return user.filmBought.length > 0;
  }

  async addWishlist(filmId: string, user_id: string) {
    const film = await this.prismaService.film.findUnique({
      where: { film_id: filmId },
    });

    if (!film) {
      throw new NotFoundException('Film not found');
    }

    const user = await this.prismaService.user.findUnique({
      where: { user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (await this.isWishlisted(filmId, user_id)) {
      // Remove from wishlist
      const updatedUser = await this.prismaService.user.update({
        where: { user_id },
        data: {
          filmWishList: {
            disconnect: { film_id: filmId },
          },
        },
      });

      return false;
    }
    const updatedUser = await this.prismaService.user.update({
      where: { user_id },
      data: {
        filmWishList: {
          connect: { film_id: filmId },
        },
      },
    });

    return true;
  }

  async isWishlisted(filmId: string, user_id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { user_id },
      include: {
        filmWishList: {
          where: { film_id: filmId },
        },
      },
    });

    return user.filmWishList.length > 0;
  }

  async getRecommendedFilms(user_id: string): Promise<FilmResponseDto[]> {
    const user = await this.prismaService.user.findUnique({
      where: { user_id },
      include: {
        filmBought: {
          include: {
            genres: true,
            Director: true,
          },
        },
        filmWishList: {
          include: {
            genres: true,
            Director: true,
          },
        },
      },
    });

    const recommendationBuilder = new RecommendationQueryBuilder();

    user.filmWishList.forEach((film) => {
      recommendationBuilder.excludeFilmIds([film.film_id]);
    });

    user.filmBought.forEach((film) => {
      recommendationBuilder
        .excludeFilmIds([film.film_id])
        .addGenres(film.genres.map((genre) => genre.genre_id))
        .addDirectors([film.Director.director_id]);
    });

    const films = await this.prismaService.film.findMany({
      ...recommendationBuilder.build(),
      include: {
        genres: true,
        Director: true,
      },
    });

    return films.map((film) => new FilmResponseDto(film));
  }
}
