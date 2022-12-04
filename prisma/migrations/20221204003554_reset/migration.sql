/*
  Warnings:

  - The primary key for the `BookshelfBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BookshelfBook` table. All the data in the column will be lost.
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
ALTER TABLE "BookshelfBook" DROP CONSTRAINT "BookshelfBook_pkey",
DROP COLUMN "id",
ALTER COLUMN "bookshelfId" SET NOT NULL,
ALTER COLUMN "bookId" SET NOT NULL,
ADD CONSTRAINT "BookshelfBook_pkey" PRIMARY KEY ("bookshelfId", "bookId");

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookshelfId_fkey" FOREIGN KEY ("bookshelfId") REFERENCES "Bookshelf"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookshelfBook" ADD CONSTRAINT "BookshelfBook_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
