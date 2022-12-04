/*
  Warnings:

  - The primary key for the `Forkedshelf` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `Forkedshelf` table. All the data in the column will be lost.
  - Added the required column `creatorId` to the `Forkedshelf` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Forkedshelf" DROP CONSTRAINT "Forkedshelf_userId_fkey";

-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "id" SET DEFAULT public.uuid_generate_v4();

-- AlterTable
ALTER TABLE "Forkedshelf" DROP CONSTRAINT "Forkedshelf_pkey",
DROP COLUMN "userId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD CONSTRAINT "Forkedshelf_pkey" PRIMARY KEY ("creatorId", "bookshelfId");

-- AddForeignKey
ALTER TABLE "Forkedshelf" ADD CONSTRAINT "Forkedshelf_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
