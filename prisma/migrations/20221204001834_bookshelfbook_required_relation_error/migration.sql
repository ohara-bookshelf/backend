/*
  Warnings:

  - The primary key for the `BookshelfBook` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "BookshelfBook" DROP CONSTRAINT "BookshelfBook_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookshelfBook" DROP CONSTRAINT "BookshelfBook_bookshelfId_fkey";

-- AlterTable
ALTER TABLE "BookshelfBook" DROP CONSTRAINT "BookshelfBook_pkey",
ADD COLUMN     "id" TEXT NOT NULL DEFAULT 'public.uuid_generate_v4()',
ALTER COLUMN "bookshelfId" DROP NOT NULL,
ALTER COLUMN "bookId" DROP NOT NULL,
ADD CONSTRAINT "BookshelfBook_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "Bookshelf"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE SET NULL ON UPDATE CASCADE;
