import { ApiProperty } from '@nestjs/swagger';
import { Film, Director, Genre } from '@prisma/client';

export class GetFilmsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

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
  cover_image_url: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  average_star: number;

  constructor(film: Film & { Director: Director; genres: Genre[] }) {
    // Assign and exclude director id
    this.id = film.film_id;
    this.director = film.Director.name;
    this.duration = film.duration;
    this.price = film.price;
    this.release_year = film.release_year;
    this.title = film.title;
    this.genre = film.genres.map((genre) => genre.name);
    this.cover_image_url = film.cover_image_url;
    this.created_at = film.created_at;
    this.updated_at = film.updated_at;
    this.average_star = film.average_star;
  }
}
