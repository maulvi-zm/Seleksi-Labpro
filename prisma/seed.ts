import { PrismaClient } from '@prisma/client';
import * as bycrypt from 'bcrypt';
import * as uuid from 'uuid';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const jsonPath =
    '/Users/maulvizm/Documents/GitHub/Seleksi-Labpro/media/metadata.json';
  const filmsMetadatas = fs.readFileSync(jsonPath, 'utf-8');
  const films = JSON.parse(filmsMetadatas);

  const directors = await prisma.director.createMany({
    data: [
      { name: 'Christoper Nolan' },
      { name: 'Steven Spielberg' },
      { name: 'James Cameron' },
      { name: 'Eichiro Oda' },
      { name: 'Tite Kubo' },
      { name: 'Masashi Kishimoto' },
      { name: 'Akira Toriyama' },
      { name: 'Hayao Miyazaki' },
      { name: 'Makoto Shinkai' },
      { name: 'Hideaki Anno' },
      { name: 'Mamoru Hosoda' },
      { name: 'Satoshi Kon' },
      { name: 'Mamoru Oshii' },
      { name: 'Isao Takahata' },
      { name: 'Katsuhiro Otomo' },
      { name: 'Mamoru Hosoda' },
      { name: 'Mamoru Oshii' },
      { name: 'Isao Takahata' },
      { name: 'Katsuhiro Otomo' },
    ],
  });

  // Seeding Genre
  const genres = await prisma.genre.createMany({
    data: [
      { name: 'Action' },
      { name: 'Adventure' },
      { name: 'Animation' },
      { name: 'Comedy' },
      { name: 'Crime' },
      { name: 'Documentary' },
      { name: 'Drama' },
      { name: 'Family' },
      { name: 'Fantasy' },
      { name: 'History' },
      { name: 'Horror' },
      { name: 'Music' },
      { name: 'Mystery' },
      { name: 'Romance' },
      { name: 'Science Fiction' },
      { name: 'TV Movie' },
      { name: 'Thriller' },
      { name: 'War' },
      { name: 'Western' },
    ],
  });

  // Seeding Film

  for (const film of films) {
    await prisma.film.create({
      data: {
        film_id: film.film_id,
        title: film.title,
        description: film.description,
        director_id: film.director_id,
        release_year: film.release_year,
        price: film.price,
        duration: film.duration,
        cover_image_url: film.cover_image_url,
        average_star: film.average_star,
        review_count: film.review_count,
        video_url: film.video_url,
        genres: {
          connect: film.genres.connect,
        },
      },
    });
  }

  const users = [];

  for (let i = 1; i <= 10; i++) {
    users.push({
      user_id: uuid.v4(),
      username: `user${i}`,
      password: bycrypt.hashSync(`password${i}`, 10),
      email: `user${i}@example.com`,
      first_name: `User`,
      last_name: `${i}`,
      balance: 100.0,
    });
  }

  // Seeding User
  for (let i = 0; i < users.length; i++) {
    await prisma.user.create({
      data: users[i],
    });
  }

  // Add Admin
  await prisma.user.create({
    data: {
      user_id: uuid.v4(),
      username: `admin`,
      password: bycrypt.hashSync(`password`, 10),
      email: `admin@example.com`,
      first_name: `Admin`,
      last_name: `Admin`,
      balance: 100.0,
      role: 'ADMIN',
    },
  });

  //   // Seeding UsersWishList
  //   const wishlists = [
  //     { user_id: 'uuid-1', film_id: 'uuid-film-1' },
  //     { user_id: 'uuid-2', film_id: 'uuid-film-2' },
  //     { user_id: 'uuid-3', film_id: 'uuid-film-3' },
  //     { user_id: 'uuid-4', film_id: 'uuid-film-1' },
  //     { user_id: 'uuid-5', film_id: 'uuid-film-2' },
  //     { user_id: 'uuid-6', film_id: 'uuid-film-3' },
  //   ];

  //   for (const wishlist of wishlists) {
  //     await prisma.usersWishList.create({
  //       data: wishlist,
  //     });
  //   }

  //   // Seeding Reviews
  //   const reviews = [
  //     {
  //       star: 5,
  //       comment: 'Amazing movie!',
  //       user_id: 'uuid-1',
  //       film_id: 'uuid-film-1',
  //     },
  //     {
  //       star: 4,
  //       comment: 'Really enjoyed it!',
  //       user_id: 'uuid-2',
  //       film_id: 'uuid-film-2',
  //     },
  //     {
  //       star: 5,
  //       comment: 'Outstanding!',
  //       user_id: 'uuid-3',
  //       film_id: 'uuid-film-3',
  //     },
  //     {
  //       star: 3,
  //       comment: 'It was okay.',
  //       user_id: 'uuid-4',
  //       film_id: 'uuid-film-1',
  //     },
  //     {
  //       star: 4,
  //       comment: 'Pretty good.',
  //       user_id: 'uuid-5',
  //       film_id: 'uuid-film-2',
  //     },
  //     {
  //       star: 5,
  //       comment: 'Loved it!',
  //       user_id: 'uuid-6',
  //       film_id: 'uuid-film-3',
  //     },
  //   ];

  //   for (const review of reviews) {
  //     await prisma.review.create({
  //       data: review,
  //     });
  //   }

  //   console.log('Seeding selesai');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
