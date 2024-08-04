import { PrismaClient } from '@prisma/client';
import * as bycrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const videoUrls = [
    'https://pub-b74693bcb5c147fc949d81f1f9dea2fc.r2.dev/CT-S2-14-MP4HD-SAMEHADAKU.CARE.mp4',
    'https://pub-b74693bcb5c147fc949d81f1f9dea2fc.r2.dev/JK-S2-19-MP4HD-SAMEHADAKU.CARE.mp4',
    'https://pub-b74693bcb5c147fc949d81f1f9dea2fc.r2.dev/OP-1113-MP4HD-SAMEHADAKU.CARE.mp4',
  ];

  const coverUrls = [
    'https://pub-b74693bcb5c147fc949d81f1f9dea2fc.r2.dev/captain-tsubasa.jpg',
    'https://pub-b74693bcb5c147fc949d81f1f9dea2fc.r2.dev/jujutsu-kaisen.webp',
    'https://pub-b74693bcb5c147fc949d81f1f9dea2fc.r2.dev/one-piece.jpg',
  ];

  const directors = await prisma.director.createMany({
    data: [
      { name: 'Christoper Nolan' },
      { name: 'Steven Spielberg' },
      { name: 'James Cameron' },
      { name: 'Eichiro Oda' },
      { name: 'Tite Kubo' },
      { name: 'Masashi Kishimoto' },
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
  const films = [
    {
      film_id: 'uuid-film-1',
      title: 'Captain Tsubasa',
      description: 'A story about a football player.',
      director_id: 1,
      release_year: 2021,
      price: 9.99,
      duration: 120,
      genres: {
        connect: [{ genre_id: 4 }, { genre_id: 5 }],
      },
      cover_image_url: coverUrls[0],
      average_star: 0,
      review_count: 0,
      video_url: videoUrls[0],
    },
    {
      film_id: 'uuid-film-2',
      title: 'Jujutsu Kaisen',
      description: 'A story about a jujutsu sorcerer.',
      director_id: 2,
      release_year: 2022,
      price: 11.99,
      duration: 140,
      genres: {
        connect: [{ genre_id: 1 }, { genre_id: 2 }],
      },
      cover_image_url: coverUrls[1],
      average_star: 0,
      review_count: 0,
      video_url: videoUrls[1],
    },
    {
      film_id: 'uuid-film-3',
      title: 'One Piece',
      description: 'A story about a pirate.',
      director_id: 3,
      release_year: 2023,
      price: 12.99,
      duration: 160,
      genres: {
        connect: [{ genre_id: 1 }, { genre_id: 2 }],
      },
      cover_image_url: coverUrls[2],
      average_star: 0,
      review_count: 0,
      video_url: videoUrls[2],
    },
  ];

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

  // Seeding User
  for (let i = 1; i <= 6; i++) {
    await prisma.user.create({
      data: {
        user_id: `uuid-user-` + i,
        username: `user${i}`,
        password: bycrypt.hashSync(`password`, 10),
        email: `user${i}@example.com`,
        first_name: `User`,
        last_name: `${i}`,
        balance: 100.0,
      },
    });
  }

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
