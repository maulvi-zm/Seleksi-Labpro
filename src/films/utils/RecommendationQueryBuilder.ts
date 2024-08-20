import { Prisma } from '@prisma/client';

export class RecommendationQueryBuilder {
  private genres: Set<number> = new Set();
  private directors: Set<number> = new Set();
  private excludedFilmIds: Set<string> = new Set();

  addGenres(genres: number[]): this {
    genres.forEach((genre) => this.genres.add(genre));
    return this;
  }

  addDirectors(directors: number[]): this {
    directors.forEach((director) => this.directors.add(director));
    return this;
  }

  excludeFilmIds(filmIds: string[]): this {
    filmIds.forEach((id) => this.excludedFilmIds.add(id));
    return this;
  }

  build(): Prisma.FilmFindManyArgs {
    return {
      where: {
        AND: [
          {
            OR: [
              {
                genres: {
                  some: {
                    genre_id: {
                      in: Array.from(this.genres),
                    },
                  },
                },
              },
              {
                Director: {
                  director_id: {
                    in: Array.from(this.directors),
                  },
                },
              },
            ],
          },
          {
            NOT: {
              film_id: {
                in: Array.from(this.excludedFilmIds),
              },
            },
          },
        ],
      },
      take: 9,
    };
  }
}
