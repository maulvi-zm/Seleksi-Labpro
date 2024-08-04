import { ApiProperty } from '@nestjs/swagger';
import { Film, Director, Genre } from '@prisma/client';

export class FilmResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  director: string;

  @ApiProperty()
  release_year: number;

  @ApiProperty()
  genre: string[];

  @ApiProperty()
  price: number;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  video_url: string;

  @ApiProperty()
  cover_image_url: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  average_star: number;

  @ApiProperty()
  review_count: number;

  constructor(film: Film & { Director: Director; genres: Genre[] }) {
    // Assign and exclude director id
    this.id = film.film_id;
    this.title = film.title;
    this.description = film.description;
    this.director = film.Director.name;
    this.release_year = film.release_year;
    this.genre = film.genres.map((genre) => genre.name);
    this.price = film.price;
    this.duration = film.duration;
    this.video_url = film.video_url;
    this.cover_image_url = film.cover_image_url;
    this.created_at = film.created_at;
    this.updated_at = film.updated_at;
    this.average_star = film.average_star;
    this.review_count = film.review_count;
  }
}
