/*
  Warnings:

  - The primary key for the `BookshelfBook` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `BookshelfBook` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "BookshelfBook" DROP CONSTRAINT "BookshelfBook_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "BookshelfBook_pkey" PRIMARY KEY ("bookshelfId", "bookId");
