/*
  Warnings:

  - Made the column `bookshelfId` on table `BookshelfBook` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bookId` on table `BookshelfBook` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "BookshelfBook" DROP CONSTRAINT "BookshelfBook_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookshelfBook" DROP CONSTRAINT "BookshelfBook_bookshelfId_fkey";

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "BookshelfBook" ALTER COLUMN "bookshelfId" SET NOT NULL,
ALTER COLUMN "bookId" SET NOT NULL,
ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "Bookshelf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
