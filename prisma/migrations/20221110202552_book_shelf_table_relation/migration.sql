/*
  Warnings:

  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileImgUrl" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "year_of_publication" INTEGER NOT NULL,
    "publisher" TEXT NOT NULL,
    "image_url_s" TEXT,
    "image_url_m" TEXT,
    "image_url_l" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookshelves" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visible" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "bookshelves_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookshelf_lists" (
    "id" TEXT NOT NULL,
    "bookshelfId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookshelf_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fork_lists" (
    "id" TEXT NOT NULL,
    "bookshelfId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "fork_lists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "books_isbn_key" ON "books"("isbn");

-- AddForeignKey
ALTER TABLE "bookshelves" ADD CONSTRAINT "bookshelves_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookshelf_lists" ADD CONSTRAINT "bookshelf_lists_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "bookshelves"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookshelf_lists" ADD CONSTRAINT "bookshelf_lists_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fork_lists" ADD CONSTRAINT "fork_lists_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "bookshelves"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fork_lists" ADD CONSTRAINT "fork_lists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
