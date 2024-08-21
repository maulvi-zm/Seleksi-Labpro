import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import * as path from 'path';
import { promises as fs } from 'fs';

const prisma = new PrismaClient();

async function saveFile(inputFile: string) {
  try {
    const pathDir = path.join(__dirname, '..', 'dist', 'public', 'uploads');
    const filePath = path.join(__dirname, '..', ...inputFile.split('/'));

    const fileBuffer = await fs.readFile(filePath);

    const fileName = inputFile.split('/').pop();
    const newFilePath = path.join(pathDir, fileName);

    // Check if the directory exists before creating it
    try {
      await fs.access(pathDir);
    } catch (error) {
      await fs.mkdir(pathDir, { recursive: true });
    }

    await fs.writeFile(newFilePath, fileBuffer);

    return 'http://localhost:3000/' + path.join('uploads', fileName);
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  const jsonPath = path.join(__dirname, '..', 'media', 'metadata.json');
  const filmsMetadatas = await fs.readFile(jsonPath, 'utf-8');
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

  for (const film of films) {
    console.log(`Processing film ${film.title}`);
    try {
      film.cover_image_url = await saveFile(film.cover_image_url);
      film.video_url = await saveFile(film.video_url);
    } catch (error) {
      console.error(`Error processing film ${film.title}:`, error);
    }
  }

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
    console.log(`Processing user ${i}`);
    users.push({
      user_id: uuid.v4(),
      username: `user${i}`,
      password: bcrypt.hashSync(`password${i}`, 10),
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
  console.log('Adding admin');
  await prisma.user.create({
    data: {
      user_id: uuid.v4(),
      username: process.env.ADMIN_USERNAME,
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
      email: `admin@example.com`,
      first_name: `Admin`,
      last_name: `Admin`,
      balance: 100.0,
      role: 'ADMIN',
    },
  });

  // Seeding Reviews
  const reviews = [
    {
      star: 5.0,
      comment: 'Amazing movie!',
      user_id: users[0].user_id,
      film_id: 'uuid-film-1',
    },
    {
      star: 4.0,
      comment: 'Really enjoyed it!',
      user_id: users[1].user_id,
      film_id: 'uuid-film-2',
    },
    {
      star: 5.0,
      comment: 'Outstanding!',
      user_id: users[2].user_id,
      film_id: 'uuid-film-3',
    },
    {
      star: 3.0,
      comment: 'It was okay.',
      user_id: users[3].user_id,
      film_id: 'uuid-film-3',
    },
    {
      star: 4.0,
      comment: 'Pretty good.',
      user_id: users[4].user_id,
      film_id: 'uuid-film-2',
    },
    {
      star: 5.0,
      comment: 'Loved it!',
      user_id: users[5].user_id,
      film_id: 'uuid-film-3',
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({
      data: review,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
