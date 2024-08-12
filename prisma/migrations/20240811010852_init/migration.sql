-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Review" (
    "review_id" SERIAL NOT NULL,
    "star" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "film_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "Film" (
    "film_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "director_id" INTEGER NOT NULL,
    "release_year" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "cover_image_url" TEXT NOT NULL,
    "average_star" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "video_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Film_pkey" PRIMARY KEY ("film_id")
);

-- CreateTable
CREATE TABLE "Director" (
    "director_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Director_pkey" PRIMARY KEY ("director_id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "genre_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("genre_id")
);

-- CreateTable
CREATE TABLE "_FilmToGenre" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UsersWishList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UsersFilm" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_FilmToGenre_AB_unique" ON "_FilmToGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_FilmToGenre_B_index" ON "_FilmToGenre"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UsersWishList_AB_unique" ON "_UsersWishList"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersWishList_B_index" ON "_UsersWishList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UsersFilm_AB_unique" ON "_UsersFilm"("A", "B");

-- CreateIndex
CREATE INDEX "_UsersFilm_B_index" ON "_UsersFilm"("B");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_film_id_fkey" FOREIGN KEY ("film_id") REFERENCES "Film"("film_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Film" ADD CONSTRAINT "Film_director_id_fkey" FOREIGN KEY ("director_id") REFERENCES "Director"("director_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmToGenre" ADD CONSTRAINT "_FilmToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Film"("film_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FilmToGenre" ADD CONSTRAINT "_FilmToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("genre_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersWishList" ADD CONSTRAINT "_UsersWishList_A_fkey" FOREIGN KEY ("A") REFERENCES "Film"("film_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersWishList" ADD CONSTRAINT "_UsersWishList_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersFilm" ADD CONSTRAINT "_UsersFilm_A_fkey" FOREIGN KEY ("A") REFERENCES "Film"("film_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UsersFilm" ADD CONSTRAINT "_UsersFilm_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
