/*
  Warnings:

  - You are about to drop the `books` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookshelf_lists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookshelves` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fork_lists` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookshelf_lists" DROP CONSTRAINT "bookshelf_lists_bookId_fkey";

-- DropForeignKey
ALTER TABLE "bookshelf_lists" DROP CONSTRAINT "bookshelf_lists_bookshelfId_fkey";

-- DropForeignKey
ALTER TABLE "bookshelves" DROP CONSTRAINT "bookshelves_userId_fkey";

-- DropForeignKey
ALTER TABLE "fork_lists" DROP CONSTRAINT "fork_lists_bookshelfId_fkey";

-- DropForeignKey
ALTER TABLE "fork_lists" DROP CONSTRAINT "fork_lists_userId_fkey";

-- DropTable
DROP TABLE "books";

-- DropTable
DROP TABLE "bookshelf_lists";

-- DropTable
DROP TABLE "bookshelves";

-- DropTable
DROP TABLE "fork_lists";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profileImgUrl" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
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

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookshelf" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "visible" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Bookshelf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookshelfList" (
    "id" TEXT NOT NULL,
    "bookshelfId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookshelfList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ForkList" (
    "id" TEXT NOT NULL,
    "bookshelfId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ForkList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Book_isbn_key" ON "Book"("isbn");

-- AddForeignKey
ALTER TABLE "Bookshelf" ADD CONSTRAINT "Bookshelf_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookshelfList" ADD CONSTRAINT "BookshelfList_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "Bookshelf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookshelfList" ADD CONSTRAINT "BookshelfList_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForkList" ADD CONSTRAINT "ForkList_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "Bookshelf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForkList" ADD CONSTRAINT "ForkList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
